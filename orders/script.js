(function(){
  const LOGO_SRC = document.querySelector('.header .logo img').src;

  // ---------- Add / remove tenant blocks ----------
  const tenantsContainer = document.getElementById('tenants-container');
  const addTenantBtn = document.getElementById('add-tenant-btn');
  let tenantCount = 1;

  addTenantBtn.addEventListener('click', function(){
    tenantCount += 1;

    const divider = document.createElement('hr');
    divider.className = 'tenant-divider';

    const block = document.createElement('div');
    block.className = 'tenant-block';
    block.dataset.tenant = String(tenantCount);

    block.innerHTML = `
      <div class="tenant-header-row">
        <span class="tenant-badge">Tenant ${tenantCount}</span>
        <button type="button" class="remove-tenant">Remove</button>
      </div>

      <div class="row">
        <div class="field">
          <label>Name</label>
          <input type="text" name="tenant${tenantCount}Name">
        </div>

        <div class="field">
          <label>Mobile</label>
          <input type="tel" name="tenant${tenantCount}Mobile">
        </div>

        <div class="field">
          <label>Email</label>
          <input type="email" name="tenant${tenantCount}Email">
        </div>
      </div>
    `;

    tenantsContainer.appendChild(divider);
    tenantsContainer.appendChild(block);

    block.querySelector('.remove-tenant').addEventListener('click', function(){
      divider.remove();
      block.remove();
    });
  });


  // ---------- PDF Generation ----------
  const generateBtn = document.getElementById('generate-btn');
  const statusEl = document.getElementById('generate-status');


  function buildPrintClone(){

    const original = document.getElementById('form-card');
    const clone = original.cloneNode(true);

    // Remove interactive-only controls
    clone.querySelectorAll(
      '.add-tenant-btn, .remove-tenant'
    ).forEach(el => el.remove());


    // Replace text/tel/email/date inputs with static value boxes
    clone.querySelectorAll(
      'input[type="text"], input[type="tel"], input[type="email"], input[type="date"]'
    ).forEach(input => {

      const div = document.createElement('div');
      div.className = 'pdf-value';

      let val = input.value ? input.value : '\u00A0';

      if (input.type === 'date' && input.value) {
        const d = new Date(input.value + 'T00:00:00');

        val = d.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }

      div.textContent = val;

      input.replaceWith(div);
    });


    // Replace textareas with static value boxes
    clone.querySelectorAll('textarea').forEach(ta => {

      const div = document.createElement('div');
      div.className = 'pdf-value';

      div.style.whiteSpace = 'pre-wrap';
      div.style.minHeight = (ta.rows * 16) + 'px';

      div.textContent = ta.value ? ta.value : '\u00A0';

      ta.replaceWith(div);
    });


    // Replace selects with static value boxes
    clone.querySelectorAll('select').forEach(sel => {

      const div = document.createElement('div');
      div.className = 'pdf-value';

      const selectedText =
        sel.selectedIndex >= 0
          ? sel.options[sel.selectedIndex].text
          : '';

      const placeholder =
        selectedText.startsWith('Select')
          ? '\u00A0'
          : selectedText;

      div.textContent = placeholder;

      sel.replaceWith(div);
    });


    // Replace checkbox groups with static checked/unchecked labels
    document.querySelectorAll('.checkbox-group').forEach((liveGroup, idx) => {

      const cloneGroup =
        clone.querySelectorAll('.checkbox-group')[idx];

      if (!cloneGroup) return;

      const wrap = document.createElement('div');
      wrap.className = 'pdf-checkbox-group';

      liveGroup.querySelectorAll(
        'input[type="checkbox"]'
      ).forEach(cb => {

        const span = document.createElement('span');

        span.textContent =
          (cb.checked ? '\u2611 ' : '\u2610 ') +
          cb.value;

        wrap.appendChild(span);
      });

      cloneGroup.replaceWith(wrap);
    });

    return clone;
  }


  // ---------- Filename Sanitization ----------
  function sanitizeForFilename(str){

    return (str || '')
      .toString()
      .trim()
      .replace(/[^a-z0-9\-_]+/gi, '_')
      .replace(/^_+|_+$/g, '');
  }


  // ---------- Generate PDF ----------
  generateBtn.addEventListener('click', async function(){

    statusEl.textContent = 'Generating PDF…';
    generateBtn.disabled = true;

    const clone = buildPrintClone();

    clone.style.width = '820px';
    clone.style.margin = '0';
    clone.style.borderRadius = '0';
    clone.style.boxShadow = 'none';


    const wrapper = document.createElement('div');

    wrapper.style.position = 'fixed';
    wrapper.style.left = '-10000px';
    wrapper.style.top = '0';
    wrapper.style.width = '820px';
    wrapper.style.background = '#ffffff';

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);


    try {

      // Wait for images to load
      const imgs = clone.querySelectorAll('img');

      await Promise.all(
        Array.from(imgs).map(img => {

          if (img.complete) {
            return img.decode
              ? img.decode().catch(() => {})
              : Promise.resolve();
          }

          return new Promise(res => {
            img.onload = res;
            img.onerror = res;
          });

        })
      );


      // Wait for browser layout/paint
      await new Promise(res =>
        requestAnimationFrame(() =>
          requestAnimationFrame(res)
        )
      );


      // Capture form
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: clone.scrollWidth,
        windowHeight: clone.scrollHeight
      });


      // Create PDF
      const { jsPDF } = window.jspdf;

      const pdf = new jsPDF({
        unit: 'pt',
        format: 'a4',
        orientation: 'portrait'
      });


      const pageWidth =
        pdf.internal.pageSize.getWidth();

      const pageHeight =
        pdf.internal.pageSize.getHeight();

      const margin = 20;

      const maxWidth =
        pageWidth - margin * 2;

      const maxHeight =
        pageHeight - margin * 2;


      // Calculate scale ratio
      const imgWidthPx = canvas.width;
      const imgHeightPx = canvas.height;

      const widthRatio =
        maxWidth / imgWidthPx;

      const heightRatio =
        maxHeight / imgHeightPx;

      const ratio =
        Math.min(widthRatio, heightRatio);


      const renderWidth =
        imgWidthPx * ratio;

      const renderHeight =
        imgHeightPx * ratio;


      const x =
        (pageWidth - renderWidth) / 2;

      const y =
        (pageHeight - renderHeight) / 2;


      // Convert canvas to image
      const imgData =
        canvas.toDataURL('image/jpeg', 0.98);


      // Add image to PDF
      pdf.addImage(
        imgData,
        'JPEG',
        x,
        y,
        renderWidth,
        renderHeight
      );


      // Generate filename
      const woId =
        sanitizeForFilename(
          document.getElementById('wo-id').value
        ) || 'unassigned';

      const dateStr =
        new Date().toISOString().slice(0, 10);

      const filename =
        `work_order_${woId}_${dateStr}.pdf`;


      // Save PDF
      pdf.save(filename);

      statusEl.textContent =
        'Downloaded: ' + filename;

    } catch (err) {

      console.error(err);

      statusEl.textContent =
        'Something went wrong generating the PDF. Please try again.';

    } finally {

      generateBtn.disabled = false;
      wrapper.remove();

    }

  });

})();
