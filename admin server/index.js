const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGO_URI || `mongodb+srv://juice_alluy:0IkRHBBp1ZuH2pGh@cluster0.ohjfkao.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;
async function run() {
  try {
    await client.connect();
    db = client.db("JuiceAlluy");
    const coffeesCollections = db.collection("coffees");
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error("Mongo connection error:", err);
  }
}
run().catch(console.dir);

// Root route
app.get('/', (req, res) => {
  res.send("This is the server of The Juice Alluy");
});

// ==========================
// Admin Auth + OTP System
// ==========================

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Admin OTP',
      text: `Your OTP is: ${otp}. Valid for 5 minutes.`
    });
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Request OTP for login
app.post('/api/admin/request-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const admins = db.collection('admins');

    let admin = await admins.findOne({ email });

    if (!admin) {
      await admins.insertOne({
        email,
        isVerified: false,
        createdAt: new Date()
      });
    }

    const otp = generateOTP();
    const backupOTP = generateOTP();

    await admins.updateOne(
      { email },
      {
        $set: {
          otp,
          backupOTP,
          otpExpiry: new Date(Date.now() + 300000)
        }
      }
    );

    const emailSent = await sendOTP(email, otp);

    if (emailSent) {
      res.json({ message: 'OTP sent to email', emailSent: true });
    } else {
      res.json({ message: 'Email failed. Use backup OTP', emailSent: false, backupOTP });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify OTP and login
app.post('/api/admin/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const admins = db.collection('admins');

    const admin = await admins.findOne({ email });

    if (!admin) return res.status(400).json({ error: 'Admin not found' });
    if (new Date(admin.otpExpiry) < new Date()) return res.status(400).json({ error: 'OTP expired' });
    if (admin.otp !== otp && admin.backupOTP !== otp) return res.status(400).json({ error: 'Invalid OTP' });

    await admins.updateOne(
      { email },
      {
        $set: { isVerified: true },
        $unset: { otp: '', backupOTP: '', otpExpiry: '' }
      }
    );

    res.json({ message: 'Login successful', admin: { email: admin.email, phone: admin.phone } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Request OTP for changing email/phone
app.post('/api/admin/request-change-otp', async (req, res) => {
  try {
    const { currentEmail } = req.body;
    const admins = db.collection('admins');

    const admin = await admins.findOne({ email: currentEmail });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    const otp = generateOTP();
    const backupOTP = generateOTP();

    await admins.updateOne(
      { email: currentEmail },
      {
        $set: { otp, backupOTP, otpExpiry: new Date(Date.now() + 300000) }
      }
    );

    const emailSent = await sendOTP(currentEmail, otp);

    if (emailSent) res.json({ message: 'OTP sent for verification', emailSent: true });
    else res.json({ message: 'Email failed. Use backup OTP', emailSent: false, backupOTP });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update email/phone with OTP
app.post('/api/admin/update-contact', async (req, res) => {
  try {
    const { currentEmail, otp, newEmail, newPhone } = req.body;
    const admins = db.collection('admins');

    const admin = await admins.findOne({ email: currentEmail });
    if (!admin) return res.status(400).json({ error: 'Admin not found' });
    if (new Date(admin.otpExpiry) < new Date()) return res.status(400).json({ error: 'OTP expired' });
    if (admin.otp !== otp && admin.backupOTP !== otp) return res.status(400).json({ error: 'Invalid OTP' });

    const updateData = {};
    if (newEmail) updateData.email = newEmail;
    if (newPhone) updateData.phone = newPhone;

    await admins.updateOne(
      { email: currentEmail },
      { $set: updateData, $unset: { otp: '', backupOTP: '', otpExpiry: '' } }
    );

    res.json({ message: 'Contact updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Request OTP for password change
app.post('/api/admin/request-password-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const admins = db.collection('admins');

    const admin = await admins.findOne({ email });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    const otp = generateOTP();
    const backupOTP = generateOTP();

    await admins.updateOne(
      { email },
      { $set: { otp, backupOTP, otpExpiry: new Date(Date.now() + 300000) } }
    );

    const emailSent = await sendOTP(email, otp);

    if (emailSent) res.json({ message: 'OTP sent to your email', emailSent: true });
    else res.json({ message: 'Email failed. Use backup OTP', emailSent: false, backupOTP });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Change password with OTP
app.post('/api/admin/change-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const admins = db.collection('admins');

    const admin = await admins.findOne({ email });
    if (!admin) return res.status(400).json({ error: 'Admin not found' });
    if (new Date(admin.otpExpiry) < new Date()) return res.status(400).json({ error: 'OTP expired' });
    if (admin.otp !== otp && admin.backupOTP !== otp) return res.status(400).json({ error: 'Invalid OTP' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await admins.updateOne(
      { email },
      { $set: { password: hashedPassword }, $unset: { otp: '', backupOTP: '', otpExpiry: '' } }
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================
// Start Server
// ==========================
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
