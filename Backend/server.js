
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });


const authRoutes = require('./routes/authRoutes');
const memberRoutes = require('./routes/memberRoutes');
const fundRoutes = require('./routes/fundRoutes');
const activityRoutes = require('./routes/activityRoutes');
const projectRoutes = require('./routes/projectRoutes');
const impactStoryRoutes = require('./routes/impactStoryRoutes');
const committeeRoutes = require('./routes/committeeRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const messageRoutes = require('./routes/messageRoutes');
const newsRoutes = require('./routes/newsRoutes');
const settingRoutes = require('./routes/settingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const publicRoutes = require('./routes/publicRoutes');

const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();


const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    if (settingRoutes && typeof settingRoutes.initSettings === 'function') {
      settingRoutes.initSettings()
        .catch(err => console.error('Failed to initialize settings:', err));
    }
  })
  .catch((err) => console.error('MongoDB Connection Error:', err));


app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser());


app.use((req, res, next) => {
  if (req.query) {
    Object.defineProperty(req, 'query', {
      value: { ...req.query },
      writable: true,
      configurable: true,
      enumerable: true
    });
  }
  next();
});
// app.use(mongoSanitize());
app.use(xss());



if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});


app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/funds', fundRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/impact-stories', impactStoryRoutes);
app.use('/api/committee', committeeRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/public', publicRoutes);


app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});


app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT);

process.on('unhandledRejection', (err) => {
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});