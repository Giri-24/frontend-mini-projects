document.getElementById('resume-form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const experience = document.getElementById('experience').value;
    const skills = document.getElementById('skills').value.split(',');
    const education = document.getElementById('education').value;
  
    const resumeContent = `
      <h3>${name}</h3>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Experience:</strong></p>
      <p>${experience}</p>
      <p><strong>Skills:</strong></p>
      <ul>${skills.map(skill => `<li>${skill.trim()}</li>`).join('')}</ul>
      <p><strong>Education:</strong></p>
      <p>${education}</p>
    `;
  
    document.getElementById('resume-content').innerHTML = resumeContent;
    document.getElementById('resume-preview').classList.remove('hidden');
  });
  
  document.getElementById('download-btn').addEventListener('click', function() {
    const resumeContent = document.getElementById('resume-content').innerHTML;
    
    const pdfWindow = window.open('', '_blank');
    pdfWindow.document.write(`
      <html>
      <head><title>Download Resume</title></head>
      <body>${resumeContent}</body>
      </html>
    `);
    pdfWindow.document.close();
    pdfWindow.print();
  });
  
