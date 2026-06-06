import { File } from '../models/file.models.js';
import cloudinary from '../config/cloudinary.js';
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import shortid from "shortid";
import QRCode from "qrcode";
import { User } from '../models/user.models.js';
import path from "path";
import streamifier from "streamifier";

const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const uploadFiles = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  const { isPassword, password, hasExpiry, expiresAt } = req.body;
  const userId = req.user.userId;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const savedFiles = [];
    for (const file of req.files) {
      const originalName = file.originalname;
      const extension = path.extname(originalName);
      const uniqueSuffix = shortid.generate();
      const finalFileName = `${originalName.replace(/\s+/g, '_')}_${uniqueSuffix}${extension}`;
      const result = await uploadToCloudinary(file.buffer, {
        folder: 'novashare',
        public_id: finalFileName,
        resource_type: 'auto',
      });
      const shortCode = shortid.generate();
      const fileObj = {
        path: result.secure_url,
        name: finalFileName,
        type: file.mimetype,
        size: file.size,
        hasExpiry: hasExpiry === 'true',
        expiresAt: hasExpiry === 'true' ? new Date(Date.now() + expiresAt * 3600000) : new Date(Date.now() + 10 * 24 * 3600000),
        status: 'active',
        shortUrl: `/f/${shortCode}`,
        createdBy: userId,
        cloudinaryPublicId: result.public_id,
      };
      if (isPassword === 'true') {
        fileObj.password = await bcrypt.hash(password, 10);
        fileObj.isPasswordProtected = true;
      }
      const savedFile = await new File(fileObj).save();
      savedFiles.push(savedFile);
      user.totalUploads += 1;
      if (file.mimetype.startsWith('image/')) user.imageCount += 1;
      else if (file.mimetype.startsWith('video/')) user.videoCount += 1;
      else if (file.mimetype.startsWith('application/')) user.documentCount += 1;
    }
    await user.save();
    return res.status(201).json({ message: "Files uploaded successfully", fileIds: savedFiles.map(f => f._id) });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "File upload failed" });
  }
};

const downloadInfo = async (req, res) => {
  const { shortCode } = req.params;
  try {
    const file = await File.findOne({ shortUrl: `/f/${shortCode}` });
    if (!file) return res.status(404).json({ error: 'File not found' });
    if (file.status !== 'active') return res.status(403).json({ error: 'File not available' });
    if (file.expiresAt && new Date(file.expiresAt) < new Date()) return res.status(410).json({ error: 'File expired' });
    file.downloadedContent++;
    await file.save();
    const user = await User.findById(file.createdBy);
    if (user) { user.totalDownloads += 1; await user.save(); }
    return res.status(200).json({
      downloadUrl: file.path, id: file._id, name: file.name, size: file.size,
      type: file.type || 'file', path: file.path, isPasswordProtected: file.isPasswordProtected || false,
      expiresAt: file.expiresAt || null, status: file.status || 'active', shortUrl: file.shortUrl,
      downloadedContent: file.downloadedContent, uploadedBy: user?.fullname || 'Unknown',
      createdAt: file.createdAt, updatedAt: file.updatedAt
    });
  } catch (error) {
    console.error("Download error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const downloadFile = async (req, res) => {
  const { fileId } = req.params;
  const { password } = req.body;
  try {
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });
    if (file.status !== 'active') return res.status(403).json({ error: 'File not available' });
    if (file.expiresAt && new Date(file.expiresAt) < new Date()) return res.status(410).json({ error: 'File expired' });
    if (file.isPasswordProtected) {
      if (!password) return res.status(401).json({ error: 'Password required' });
      const isMatch = await bcrypt.compare(password, file.password);
      if (!isMatch) return res.status(403).json({ error: 'Incorrect password' });
    }
    file.downloadedContent++;
    await file.save();
    const user = await User.findById(file.createdBy);
    if (user) { user.totalDownloads += 1; await user.save(); }
    return res.status(200).json({ downloadUrl: file.path });
  } catch (error) {
    console.error("Download error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteFile = async (req, res) => {
  const { fileId } = req.params;
  try {
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });
    if (file.status === 'deleted') return res.status(400).json({ error: 'File already deleted' });
    if (file.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(file.cloudinaryPublicId, { resource_type: 'auto' });
    }
    await File.deleteOne({ _id: fileId });
    return res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateFileStatus = async (req, res) => {
  const { fileId } = req.params;
  const { status } = req.body;
  try {
    if (!['active', 'inactive'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });
    if (file.status === status) return res.status(400).json({ error: 'File already has this status' });
    file.status = status;
    await file.save();
    return res.status(200).json({ message: 'File status updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateFileExpiry = async (req, res) => {
  const { fileId } = req.params;
  const { expiresAt } = req.body;
  try {
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });
    if (expiresAt) file.expiresAt = new Date(Date.now() + expiresAt * 3600000);
    await file.save();
    return res.status(200).json({ message: 'File expiry updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateAllFileExpiry = async (req, res) => {
  try {
    const files = await File.find();
    if (!files || files.length === 0) return res.status(404).json({ error: 'No files found' });
    for (const file of files) {
      if (file.status === 'deleted') continue;
      if (file.expiresAt && new Date(file.expiresAt) < new Date()) {
        file.status = 'expired'; file.hasExpiry = true;
      } else {
        file.expiresAt = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); file.hasExpiry = true;
      }
      await file.save();
    }
    return res.status(200).json({ message: 'All file expiries updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateFilePassword = async (req, res) => {
  const { fileId } = req.params;
  const { newPassword } = req.body;
  try {
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });
    if (!newPassword) return res.status(400).json({ error: 'New password is required' });
    file.password = await bcrypt.hash(newPassword, 10);
    await file.save();
    return res.status(200).json({ message: 'File password updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Error updating file password' });
  }
};

const searchFiles = async (req, res) => {
  const { query } = req.query;
  try {
    const files = await File.find({ name: { $regex: query, $options: 'i' } });
    if (!files.length) return res.status(404).json({ message: 'No files found' });
    return res.status(200).json(files);
  } catch (error) {
    return res.status(500).json({ error: 'Error searching files' });
  }
};

const showUserFiles = async (req, res) => {
  const userId = req.user.userId;
  try {
    const files = await File.find({ createdBy: userId });
    if (!files.length) return res.status(404).json({ message: 'No files found' });
    return res.status(200).json(files);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching user files' });
  }
};

const getFileDetails = async (req, res) => {
  const { fileId } = req.params;
  try {
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ message: 'File not found' });
    return res.status(200).json(file);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching file details' });
  }
};

const generateShareShortenLink = async (req, res) => {
  const { fileId } = req.body;
  try {
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });
    const shortCode = shortid.generate();
    file.shortUrl = `${process.env.BASE_URL}/f/${shortCode}`;
    await file.save();
    res.status(200).json({ shortUrl: file.shortUrl });
  } catch (error) {
    res.status(500).json({ error: 'Error generating short link' });
  }
};

const sendLinkEmail = async (req, res) => {
  const { fileId, email } = req.body;
  try {
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
    });
    await transporter.sendMail({
      from: `"NovaShare" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Your Shared File Link',
      html: `<div style="font-family:Arial,sans-serif"><h2>You received a file via NovaShare</h2>
        <p><strong>File:</strong> ${file.name}</p>
        <p><strong>Size:</strong> ${(file.size/1024).toFixed(2)} KB</p>
        <p><a href="${file.path}">Click here to download</a></p>
        ${file.expiresAt ? `<p>Expires: ${new Date(file.expiresAt).toLocaleString()}</p>` : ''}</div>`
    });
    res.status(200).json({ message: 'Link sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending link' });
  }
};

const generateQR = async (req, res) => {
  const { fileId } = req.params;
  try {
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });
    const qrDataUrl = await QRCode.toDataURL(file.path);
    res.status(200).json({ qr: qrDataUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
};

const getDownloadCount = async (req, res) => {
  const { fileId } = req.params;
  try {
    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ error: 'File not found' });
    res.status(200).json({ downloadCount: file.downloadedContent });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get download count' });
  }
};

const resolveShareLink = async (req, res) => {
  const { code } = req.params;
  const shortUrl = `${process.env.BASE_URL}/f/${code}`;
  try {
    const file = await File.findOne({ shortUrl });
    if (!file) return res.status(404).json({ error: 'Invalid or expired link' });
    if (file.expiresAt && new Date() > file.expiresAt) {
      file.status = 'expired'; await file.save();
      return res.status(410).json({ error: 'This file has expired.' });
    }
    return res.status(200).json({
      fileId: file._id, name: file.name, size: file.size, type: file.type || 'file',
      previewUrl: file.path, isPasswordProtected: file.isPasswordProtected || false,
      expiresAt: file.expiresAt || null, status: file.status || 'active',
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const verifyFilePassword = async (req, res) => {
  const { shortCode, password } = req.body;
  try {
    const file = await File.findOne({ shortUrl: `/f/${shortCode}` });
    if (!file || !file.isPasswordProtected) return res.status(400).json({ success: false, error: 'File not protected or not found' });
    const isMatch = await bcrypt.compare(password, file.password);
    if (!isMatch) return res.status(401).json({ success: false, error: 'Incorrect password' });
    return res.status(200).json({ success: true, message: 'Password verified' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const getUserFiles = async (req, res) => {
  const { userId } = req.params;
  try {
    const files = await File.find({ createdBy: userId });
    if (!files.length) return res.status(404).json({ message: 'No files found' });
    return res.status(200).json(files);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching user files' });
  }
};

export {
  uploadFiles, downloadFile, deleteFile, updateFileStatus, updateFileExpiry,
  updateFilePassword, searchFiles, showUserFiles, getFileDetails,
  generateShareShortenLink, sendLinkEmail, generateQR, getDownloadCount,
  resolveShareLink, verifyFilePassword, getUserFiles, updateAllFileExpiry, downloadInfo,
};
