//frontend/src/services/certificateService.jsx

// Certificate service for generating PDF certificates
export const generateCertificate = async (enrollmentData) => {
  try {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      throw new Error('Failed to open print window. Please allow popups for this site.');
    }
    
    // Generate certificate HTML
    const certificateHTML = generateCertificateHTML(enrollmentData);
    
    // Write the certificate to the new window
    printWindow.document.write(certificateHTML);
    printWindow.document.close();
    
    // Wait for the content to load, then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
    
    return true;
  } catch (error) {
    console.error('Error generating certificate:', error);
    throw error;
  }
};

// Generate HTML for certificate
const generateCertificateHTML = (enrollmentData) => {
  const completionDate = new Date(enrollmentData.completedAt || enrollmentData.updatedAt || Date.now());
  const enrollmentDate = new Date(enrollmentData.enrolledAt || Date.now());
  const certificateId = `CERT-${enrollmentData.id || enrollmentData._id || Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
  // Extract user information with fallbacks
  const userName = enrollmentData.user?.name || 
                   enrollmentData.userName || 
                   enrollmentData.studentName || 
                   'Student Name';
  
  const userId = enrollmentData.user?.id || 
                enrollmentData.user?._id || 
                enrollmentData.userId || 
                enrollmentData.studentId || 
                'STU-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  
  // Extract course information with multiple fallback paths
  const courseTitle = enrollmentData.course?.title || 
                      enrollmentData.courseId?.title || 
                      enrollmentData.title || 
                      enrollmentData.courseName || 
                      'Course Title';
  
  const courseId = enrollmentData.course?.id || 
                  enrollmentData.course?._id || 
                  enrollmentData.courseId?.id || 
                  enrollmentData.courseId?._id || 
                  enrollmentData.courseId || 
                  'CRS-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  
  const duration = enrollmentData.course?.duration || 
                  enrollmentData.courseId?.duration || 
                  enrollmentData.duration || 
                  enrollmentData.hours || 
                  'N/A';
  
  const skillName = enrollmentData.course?.skillName || 
                   enrollmentData.course?.skill?.name || 
                   enrollmentData.courseId?.skillName || 
                   enrollmentData.courseId?.skill?.name || 
                   enrollmentData.skillName || 
                   enrollmentData.skill || 
                   'Professional Development';
  
  const level = enrollmentData.course?.level || 
               enrollmentData.courseId?.level || 
               enrollmentData.level ||
               enrollmentData.difficulty ||
               enrollmentData.course?.difficulty ||
               enrollmentData.courseId?.difficulty ||
               'Intermediate';
  
  // Calculate duration if not provided
  const displayDuration = duration !== 'N/A' ? `${duration} Hours` : 'Self-paced';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Certificate of Completion</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: 'Georgia', serif;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .certificate-container {
      width: 794px;
      height: 1123px;
      position: relative;
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border: 3px solid #0ea5e9;
      box-sizing: border-box;
      padding: 40px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    
    .certificate-inner {
      border: 2px solid #0284c7;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      padding: 50px 60px;
      box-sizing: border-box;
      position: relative;
    }
    
    .certificate-inner::before {
      content: '';
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
      border: 1px solid #cbd5e1;
      z-index: -1;
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .logo {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      color: white;
      font-weight: bold;
      font-size: 24px;
    }
    
    .title {
      color: #1e293b;
      font-size: 42px;
      font-weight: bold;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    
    .subtitle {
      color: #475569;
      font-size: 18px;
      margin-bottom: 40px;
      font-style: italic;
    }
    
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .certify-text {
      color: #64748b;
      font-size: 20px;
      margin-bottom: 20px;
    }
    
    .student-name {
      color: #1e293b;
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 20px;
      text-decoration: underline;
      text-underline-offset: 8px;
      text-decoration-color: #3b82f6;
      text-decoration-thickness: 2px;
    }
    
    .achievement-text {
      color: #475569;
      font-size: 18px;
      margin-bottom: 30px;
      line-height: 1.6;
    }
    
    .course-title {
      color: #1e293b;
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 40px;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .course-info {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 40px;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .info-item {
      text-align: left;
    }
    
    .info-label {
      color: #64748b;
      font-size: 14px;
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .info-value {
      color: #1e293b;
      font-size: 18px;
      font-weight: bold;
    }
    
    .dates {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #e2e8f0;
      padding-top: 20px;
    }
    
    .date-item {
      text-align: center;
      flex: 1;
    }
    
    .date-label {
      color: #64748b;
      font-size: 12px;
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .date-value {
      color: #1e293b;
      font-size: 16px;
      font-weight: bold;
    }
    
    .divider {
      width: 60%;
      height: 2px;
      background: linear-gradient(90deg, transparent, #3b82f6, transparent);
      margin: 40px 0;
    }
    
    .badges {
      display: flex;
      justify-content: center;
      gap: 50px;
      margin-bottom: 40px;
    }
    
    .badge {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 11px;
      text-align: center;
      line-height: 1.2;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    
    .badge-green {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }
    
    .badge-blue {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    }
    
    .signatures {
      display: flex;
      justify-content: space-between;
      width: 100%;
      max-width: 600px;
      margin-top: 20px;
    }
    
    .signature {
      text-align: center;
      flex: 1;
    }
    
    .signature-line {
      width: 200px;
      height: 2px;
      background: #94a3b8;
      margin-bottom: 10px;
    }
    
    .signature-label {
      color: #64748b;
      font-size: 14px;
      margin-bottom: 5px;
    }
    
    .signature-value {
      color: #1e293b;
      font-size: 12px;
      font-style: italic;
    }
    
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      width: 100%;
    }
    
    .certificate-id {
      color: #94a3b8;
      font-size: 12px;
      text-align: left;
    }
    
    .verification-code {
      color: #94a3b8;
      font-size: 12px;
      text-align: right;
    }
    
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 120px;
      color: #e2e8f0;
      font-weight: bold;
      opacity: 0.3;
      pointer-events: none;
      z-index: 0;
    }
    
    @media print {
      body {
        background: white;
      }
      
      .certificate-container {
        box-shadow: none;
      }
      
      .watermark {
        opacity: 0.1;
      }
    }
  </style>
</head>
<body>
  <div class="certificate-container">
    <div class="certificate-inner">
      <div class="watermark">AFY1S</div>
      
      <div class="header">
        <div class="logo">AFY1S</div>
        <div class="title">Certificate of Completion</div>
        <div class="subtitle">Awarded for Outstanding Achievement</div>
      </div>
      
      <div class="content">
        <div class="certify-text">This is to certify that</div>
        <div class="student-name">${userName}</div>
        <div class="achievement-text">has successfully demonstrated mastery and completed the requirements for</div>
        <div class="course-title">${courseTitle}</div>
        
        <div class="course-info">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Duration</div>
              <div class="info-value">${displayDuration}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Skill Level</div>
              <div class="info-value">${level}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Primary Skill</div>
              <div class="info-value">${skillName}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Grade</div>
              <div class="info-value">Excellent (100%)</div>
            </div>
          </div>
          
          <div class="dates">
            <div class="date-item">
              <div class="date-label">Enrollment Date</div>
              <div class="date-value">${enrollmentDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}</div>
            </div>
            <div class="date-item">
              <div class="date-label">Completion Date</div>
              <div class="date-value">${completionDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </div>
          </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="badges">
          <div class="badge badge-green">Course<br>Complete</div>
          <div class="badge badge-blue">Skill<br>Mastered</div>
        </div>
      </div>
      
      <div class="signatures">
        <div class="signature">
          <div class="signature-line"></div>
          <div class="signature-label">Instructor Signature</div>
          <div class="signature-value">Authorized Signatory</div>
        </div>
        <div class="signature">
          <div class="signature-line"></div>
          <div class="signature-label">Date</div>
          <div class="signature-value">${completionDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</div>
        </div>
      </div>
      
      <div class="footer">
        <div class="certificate-id">Certificate ID: ${certificateId}</div>
        <div class="verification-code">Verify Online: afy1s.com/verify/${certificateId}</div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

