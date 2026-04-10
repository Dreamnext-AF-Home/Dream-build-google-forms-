/**
 * DREAMBUILD DESIGN STUDIO — Client Onboarding Google Form Builder
 * ─────────────────────────────────────────────────────────────────
 * HOW TO USE:
 *  1. Go to https://script.google.com  (sign in as rnd001.apsara@gmail.com)
 *  2. Click "New Project"
 *  3. Delete any starter code, paste THIS entire script
 *  4. Click the ▶ Run button (select createDreambuildForm if prompted)
 *  5. Grant the permissions it asks for
 *  6. Check your Google Drive — the Form and linked Sheet will appear there
 *  7. The script will also set up automatic email alerts to rnd001.apsara@gmail.com
 *     every time a client submits the form.
 * ─────────────────────────────────────────────────────────────────
 */

var NOTIFY_EMAIL = 'rnd001.apsara@gmail.com';
var BRAND_VERSION = 'v1.0';
var BRAND_LOGO_URL = '';

/**
 * Web app endpoint for the Next.js onboarding form.
 * Deploy as: Deploy > New deployment > Web app
 * Execute as: Me
 * Who has access: Anyone
 */
function doPost(e) {
  try {
    var payload = extractPayload_(e);
    sendWebFormNotification_(payload);

    return jsonResponse_({
      success: true,
      message: 'Submission sent successfully to ' + NOTIFY_EMAIL
    });
  } catch (error) {
    return jsonResponse_({
      success: false,
      message: error && error.message ? error.message : 'Unknown submission error'
    });
  }
}

// ─────────────────────────────────────────────────────────────────
//  MAIN: Create form + wire up email trigger
// ─────────────────────────────────────────────────────────────────
function createDreambuildForm() {

  // ── 1. Create the Form ──────────────────────────────────────────
  var form = FormApp.create('Dreambuild Design Studio — Client Onboarding Form');
  form.setTitle('Dreambuild Design Studio — Client Onboarding Form');
  form.setDescription(
    'This form collects complete client, project, and design information before ' +
    'concept development, costing, and project scheduling begin. Please fill out all applicable sections.'
  );
  form.setCollectEmail(true);
  form.setAllowResponseEdits(true);
  form.setProgressBar(true);

  // ── 2. Link a Google Sheet for responses ────────────────────────
  var ss = SpreadsheetApp.create('Dreambuild Onboarding Responses');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  // ════════════════════════════════════════════════════════════════
  //  PAGE 1 — Client Information
  // ════════════════════════════════════════════════════════════════
  form.addSectionHeaderItem()
      .setTitle('Page 1 of 4 — Client Information')
      .setHelpText('Please provide your personal and contact details.');

  // Primary Contact
  form.addSectionHeaderItem().setTitle('Primary Contact');

  form.addTextItem()
      .setTitle('Client Full Name')
      .setRequired(true);

  form.addTextItem()
      .setTitle('Company Name (if any)');

  form.addTextItem()
      .setTitle('Mobile Number')
      .setRequired(true);

  form.addTextItem()
      .setTitle('Viber / WhatsApp Number');

  form.addTextItem()
      .setTitle('Email Address')
      .setRequired(true);

  form.addCheckboxItem()
      .setTitle('Preferred Contact Method')
      .setChoiceValues(['Call', 'Viber', 'WhatsApp', 'Email'])
      .setRequired(true);

  form.addParagraphTextItem()
      .setTitle('Residential Address');

  form.addTextItem()
      .setTitle('City / Barangay');

  form.addTextItem()
      .setTitle('Nationality');

  form.addTextItem()
      .setTitle('Valid ID Type and Number');

  // Secondary Contact
  form.addSectionHeaderItem().setTitle('Secondary Contact / Authorized Representative');

  form.addTextItem()
      .setTitle('Representative Full Name');

  form.addTextItem()
      .setTitle('Relationship to Client');

  form.addTextItem()
      .setTitle('Representative Mobile Number');

  form.addTextItem()
      .setTitle('Representative Email Address');

  // ════════════════════════════════════════════════════════════════
  //  PAGE BREAK → Page 2
  // ════════════════════════════════════════════════════════════════
  form.addPageBreakItem()
      .setTitle('Project Information & Household Profile');

  // ── Section 2: Project Information ──────────────────────────────
  form.addSectionHeaderItem()
      .setTitle('Page 2 of 4 — Project & Household Details');

  form.addTextItem()
      .setTitle('Project Name / Reference');

  form.addParagraphTextItem()
      .setTitle('Project Address')
      .setRequired(true);

  form.addCheckboxItem()
      .setTitle('Property Type')
      .setChoiceValues(['House', 'Condominium', 'Office', 'Commercial Space', 'Other'])
      .setRequired(true);

  form.addCheckboxItem()
      .setTitle('Project Type')
      .setChoiceValues(['New Build', 'Renovation', 'Interior Fit-out', 'Consultation Only'])
      .setRequired(true);

  form.addTextItem()
      .setTitle('Floor Area (sqm)');

  form.addTextItem()
      .setTitle('Number of Floors');

  form.addMultipleChoiceItem()
      .setTitle('Current Status of Property')
      .setChoiceValues(['Bare', 'Existing Occupied Space', 'Turnover Pending', 'Under Construction'])
      .setRequired(true);

  form.addDateItem()
      .setTitle('Target Move-in / Turnover Date');

  form.addMultipleChoiceItem()
      .setTitle('Is the property owned or leased?')
      .setChoiceValues(['Owned', 'Leased']);

  // ── Section 3: Household / User Profile ─────────────────────────
  form.addSectionHeaderItem().setTitle('Household / User Profile');

  form.addTextItem()
      .setTitle('Number of Adults');

  form.addTextItem()
      .setTitle('Children (with ages)');

  form.addMultipleChoiceItem()
      .setTitle('Elderly in household?')
      .setChoiceValues(['Yes', 'No']);

  form.addMultipleChoiceItem()
      .setTitle('Persons with disability / accessibility needs?')
      .setChoiceValues(['Yes', 'No']);

  form.addTextItem()
      .setTitle('Pets (type and quantity)');

  form.addParagraphTextItem()
      .setTitle('Daily lifestyle / routine notes');

  form.addParagraphTextItem()
      .setTitle('Storage needs or special requirements');

  // ── Section 4: Scope of Work ─────────────────────────────────────
  form.addSectionHeaderItem().setTitle('Scope of Work — Spaces Included');

  form.addCheckboxItem()
      .setTitle('Please check all spaces included in the project')
      .setChoiceValues([
        'Living Room', 'Dining Area', 'Kitchen',
        'Master Bedroom', 'Bedroom 2', 'Bedroom 3',
        'Toilet and Bath', 'Powder Room', 'Home Office / Study',
        'Entertainment Area', 'Balcony / Terrace', 'Laundry / Utility Area',
        'Storage Room', 'Commercial Reception Area', 'Workstations / Office Area',
        'Other'
      ])
      .setRequired(true);

  form.addTextItem()
      .setTitle('Other space (please specify)');

  // ════════════════════════════════════════════════════════════════
  //  PAGE BREAK → Page 3
  // ════════════════════════════════════════════════════════════════
  form.addPageBreakItem()
      .setTitle('Budget, Timeline & Design Preferences');

  // ── Section 5: Budget and Timeline ──────────────────────────────
  form.addSectionHeaderItem()
      .setTitle('Page 3 of 4 — Budget, Timeline & Design Preferences');

  form.addTextItem()
      .setTitle('Estimated Total Budget (PHP)')
      .setRequired(true);

  form.addTextItem()
      .setTitle('Design Fee Budget (if applicable)');

  form.addTextItem()
      .setTitle('Construction / Fit-out Budget');

  form.addTextItem()
      .setTitle('Furniture and Décor Budget');

  form.addMultipleChoiceItem()
      .setTitle('Budget Flexibility')
      .setChoiceValues(['Fixed', 'Flexible within 10%', 'Flexible depending on proposal'])
      .setRequired(true);

  form.addDateItem()
      .setTitle('Desired Project Start Date');

  form.addDateItem()
      .setTitle('Desired Completion Date');

  form.addMultipleChoiceItem()
      .setTitle('Timeline Priority')
      .setChoiceValues(['Fast Completion', 'Balanced', 'Quality First'])
      .setRequired(true);

  form.addMultipleChoiceItem()
      .setTitle('Main Decision Driver')
      .setChoiceValues(['Budget', 'Design Quality', 'Function', 'Timeline'])
      .setRequired(true);

  // ── Section 6: Design Preferences ───────────────────────────────
  form.addSectionHeaderItem().setTitle('Design Preferences');

  form.addCheckboxItem()
      .setTitle('Preferred Style')
      .setChoiceValues([
        'Modern', 'Contemporary', 'Minimalist', 'Scandinavian',
        'Industrial', 'Japandi', 'Classic', 'Luxury',
        'Tropical', 'Eclectic', 'Other'
      ])
      .setRequired(true);

  form.addTextItem()
      .setTitle('Other style (please specify)');

  form.addTextItem()
      .setTitle('Preferred Colours');

  form.addTextItem()
      .setTitle('Colours to Avoid');

  form.addTextItem()
      .setTitle('Preferred Wall Finish');

  form.addTextItem()
      .setTitle('Preferred Flooring');

  form.addTextItem()
      .setTitle('Preferred Cabinet Finish');

  form.addTextItem()
      .setTitle('Preferred Countertop Material');

  form.addTextItem()
      .setTitle('Preferred Hardware Finish');

  form.addTextItem()
      .setTitle('Materials / Finishes to Avoid');

  form.addParagraphTextItem()
      .setTitle('Pinterest / Mood Board Links');

  form.addParagraphTextItem()
      .setTitle('Pegs / Inspirations from social media or websites');

  form.addParagraphTextItem()
      .setTitle('Existing furniture or décor to retain');

  // ════════════════════════════════════════════════════════════════
  //  PAGE BREAK → Page 4
  // ════════════════════════════════════════════════════════════════
  form.addPageBreakItem()
      .setTitle('Site Assessment, Commercial Terms & Submission');

  // ── Section 7: Site Assessment ───────────────────────────────────
  form.addSectionHeaderItem()
      .setTitle('Page 4 of 4 — Site, Commercial Terms & Checklist');

  form.addMultipleChoiceItem()
      .setTitle('Site Visit Required?')
      .setChoiceValues(['Yes', 'No'])
      .setRequired(true);

  form.addDateItem()
      .setTitle('Preferred Site Visit Date');

  form.addTextItem()
      .setTitle('Best Time for Visit');

  form.addMultipleChoiceItem()
      .setTitle('Existing Plans Available?')
      .setChoiceValues(['Yes', 'No']);

  form.addCheckboxItem()
      .setTitle('If yes, available documents')
      .setChoiceValues(['Floor Plan', 'As-built Plan', 'Electrical Plan', 'Plumbing Plan', 'Ceiling Plan']);

  form.addParagraphTextItem()
      .setTitle('Site restrictions / building admin requirements');

  form.addTextItem()
      .setTitle('Parking / delivery restrictions');

  form.addTextItem()
      .setTitle('Work hour limitations');

  // ── Section 8: Commercial Terms ───────────────────────────────────
  form.addSectionHeaderItem().setTitle('Commercial Terms');

  form.addCheckboxItem()
      .setTitle('Service Required')
      .setChoiceValues([
        'Design Consultation Only',
        'Design + Procurement',
        'Full Design and Build',
        'Fit-out Only'
      ])
      .setRequired(true);

  form.addTextItem()
      .setTitle('Preferred Payment Arrangement');

  form.addTextItem()
      .setTitle('Billing Name / Company Name');

  form.addParagraphTextItem()
      .setTitle('Billing Address');

  form.addMultipleChoiceItem()
      .setTitle('VAT Requirement')
      .setChoiceValues(['Yes', 'No']);

  form.addTextItem()
      .setTitle('Official Receipt / Invoice Details');

  // ── Section 9: Communication & Approval ──────────────────────────
  form.addSectionHeaderItem().setTitle('Communication & Approval Process');

  form.addTextItem()
      .setTitle('Primary decision maker');

  form.addTextItem()
      .setTitle('Who approves design proposals?');

  form.addTextItem()
      .setTitle('Who approves budget revisions?');

  form.addMultipleChoiceItem()
      .setTitle('Preferred meeting mode')
      .setChoiceValues(['Face-to-face', 'Video Call', 'Phone Call']);

  form.addTextItem()
      .setTitle('Preferred schedule for updates (e.g. every Friday, weekly)');

  form.addCheckboxItem()
      .setTitle('Preferred channel for file sharing')
      .setChoiceValues(['Email', 'Viber', 'WhatsApp', 'Google Drive']);

  // ── Section 10: Submission Checklist ─────────────────────────────
  form.addSectionHeaderItem().setTitle('Client Submission Checklist');

  form.addCheckboxItem()
      .setTitle('Please confirm which documents you are submitting')
      .setChoiceValues([
        'Copy of valid ID',
        'Floor plan / as-built drawing',
        'Photos / videos of existing site',
        'Pegs / inspiration images',
        'Condominium / building guidelines',
        'Target budget range',
        'Other relevant technical documents'
      ]);

  form.addParagraphTextItem()
      .setTitle('Notes and Special Instructions');

  // ── Acknowledgment ────────────────────────────────────────────────
  form.addSectionHeaderItem()
      .setTitle('Acknowledgment')
      .setHelpText(
        'By submitting this form, the client confirms that the information provided is accurate ' +
        'and may be used by Dreambuild Design Studio for project assessment, concept preparation, ' +
        'quotation, and coordination.'
      );

  form.addTextItem()
      .setTitle('Client Full Name (for acknowledgment)')
      .setRequired(true);

  form.addDateItem()
      .setTitle('Date of Submission')
      .setRequired(true);

  // ── Confirmation message ──────────────────────────────────────────
  form.setConfirmationMessage(
    'Thank you! Your onboarding form has been submitted to Dreambuild Design Studio. ' +
    'Our team will review your details and reach out shortly to confirm next steps.'
  );

  // ── 3. Set up email notification trigger ─────────────────────────
  // Delete any existing onFormSubmit triggers for this form first (avoid duplicates)
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'sendEmailNotification') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  ScriptApp.newTrigger('sendEmailNotification')
      .forForm(form)
      .onFormSubmit()
      .create();

  // ── 4. Log the form URL ──────────────────────────────────────────
  Logger.log('✅ Form created successfully!');
  Logger.log('📋 Form edit URL: ' + form.getEditUrl());
  Logger.log('🔗 Form public URL: ' + form.getPublishedUrl());
  Logger.log('📊 Responses Sheet: ' + ss.getUrl());
  Logger.log('📧 Email notifications will be sent to: ' + NOTIFY_EMAIL);
}

// ─────────────────────────────────────────────────────────────────
//  EMAIL NOTIFICATION — fires on every form submission
// ─────────────────────────────────────────────────────────────────
function sendEmailNotification(e) {
  var response      = e.response;
  var submittedAt   = response.getTimestamp();
  var itemResponses = response.getItemResponses();
  var uploadAttachments = [];

  // Build a summary table of all answers
  var rows = '';
  for (var i = 0; i < itemResponses.length; i++) {
    var item   = itemResponses[i];
    var formItem = item.getItem();
    var title  = formItem.getTitle();
    var answer = item.getResponse();
    var itemType = formItem.getType();

    if (itemType === FormApp.ItemType.FILE_UPLOAD) {
      var uploadResult = getDriveFileUploadSummary_(answer, title);
      answer = uploadResult.summary;
      uploadAttachments = uploadAttachments.concat(uploadResult.attachments);
    }

    // Arrays (checkboxes) → comma-separated string
    if (Array.isArray(answer)) {
      answer = answer.join(', ');
    }

    rows += '<tr>' +
              '<td style="padding:6px 12px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9;vertical-align:top;width:40%;">' +
                escapeHtml(title) +
              '</td>' +
              '<td style="padding:6px 12px;border:1px solid #ddd;vertical-align:top;">' +
                escapeHtml(String(answer || '—')) +
              '</td>' +
            '</tr>';
  }

  // Grab the client name if answered (first required text field)
  var clientName = '(not provided)';
  for (var j = 0; j < itemResponses.length; j++) {
    if (itemResponses[j].getItem().getTitle() === 'Client Full Name') {
      clientName = itemResponses[j].getResponse() || clientName;
      break;
    }
  }

  var subject = '📋 New Onboarding Submission — ' + clientName +
                ' (' + Utilities.formatDate(submittedAt, Session.getScriptTimeZone(), 'MMM dd, yyyy hh:mm a') + ')';

  var pdfAttachment = createSubmissionPdf_({
    title: 'Dreambuild Onboarding Submission',
    subtitle: 'Google Form response export',
    clientName: clientName,
    submittedAt: submittedAt,
    rows: rows
  });

  var body =
    '<div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;">' +
      createEmailHeaderHtml_('New Client Onboarding Form Submission') +

      '<div style="background:#ffffff;padding:24px;border:1px solid #ddd;border-top:none;">' +
        '<p style="margin:0 0 16px;">A new client onboarding form was submitted on ' +
          '<strong>' + Utilities.formatDate(submittedAt, Session.getScriptTimeZone(), 'MMMM dd, yyyy \'at\' hh:mm a z') + '</strong>.' +
        '</p>' +

        '<table style="width:100%;border-collapse:collapse;font-size:14px;">' +
          '<thead>' +
            '<tr>' +
              '<th style="padding:8px 12px;background:#1a1a2e;color:#fff;text-align:left;border:1px solid #ddd;">Field</th>' +
              '<th style="padding:8px 12px;background:#1a1a2e;color:#fff;text-align:left;border:1px solid #ddd;">Answer</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' + rows + '</tbody>' +
        '</table>' +

        '<p style="margin:24px 0 0;font-size:13px;color:#888;">' +
          'This is an automated notification from your Dreambuild Onboarding Form. ' +
          'Replies to this email go to the client\'s submitted email address (if provided).' +
        '</p>' +
      '</div>' +

      '<div style="background:#f4f4f4;padding:12px 24px;border-radius:0 0 8px 8px;border:1px solid #ddd;border-top:none;">' +
        '<p style="margin:0;font-size:12px;color:#aaa;">Dreambuild Design Studio — Automated Form Notification</p>' +
      '</div>' +
    '</div>';

  MailApp.sendEmail({
    to:       NOTIFY_EMAIL,
    subject:  subject,
    htmlBody: body,
    attachments: [pdfAttachment].concat(uploadAttachments)
  });
}

function sendWebFormNotification_(payload) {
  var submittedAt = new Date();
  var sections = payload.sections || {};
  var uploads = payload.uploads || {};
  var rows = '';
  var clientName = payload.acknowledgmentName ||
                   payload.clientFullName ||
                   '(not provided)';

  for (var sectionName in sections) {
    if (!sections.hasOwnProperty(sectionName)) continue;

    rows += '<tr>' +
              '<td colspan="2" style="padding:10px 12px;border:1px solid #ddd;background:#f2ede8;font-weight:bold;color:#4d2f1d;">' +
                escapeHtml(sectionName) +
              '</td>' +
            '</tr>';

    var sectionFields = sections[sectionName];
    for (var fieldLabel in sectionFields) {
      if (!sectionFields.hasOwnProperty(fieldLabel)) continue;

      var answer = sectionFields[fieldLabel];
      if (Array.isArray(answer)) {
        answer = answer.join(', ');
      }

      rows += '<tr>' +
                '<td style="padding:6px 12px;border:1px solid #ddd;font-weight:bold;background:#f9f9f9;vertical-align:top;width:38%;">' +
                  escapeHtml(fieldLabel) +
                '</td>' +
                '<td style="padding:6px 12px;border:1px solid #ddd;vertical-align:top;">' +
                  escapeHtml(String(answer || '—')) +
                '</td>' +
              '</tr>';
    }
  }

  var subject = '📋 Web Onboarding Submission — ' + clientName +
                ' (' + Utilities.formatDate(submittedAt, Session.getScriptTimeZone(), 'MMM dd, yyyy hh:mm a') + ')';

  var pdfAttachment = createSubmissionPdf_({
    title: 'Dreambuild Website Submission',
    subtitle: 'Website onboarding response export',
    clientName: clientName,
    submittedAt: submittedAt,
    rows: rows
  });

  var body =
    '<div style="font-family:Arial,sans-serif;max-width:760px;margin:0 auto;">' +
      createEmailHeaderHtml_('New website onboarding submission received') +
      '<div style="background:#ffffff;padding:24px;border:1px solid #ddd;border-top:none;">' +
        '<p style="margin:0 0 16px;color:#4d2f1d;">Submitted on <strong>' +
          Utilities.formatDate(submittedAt, Session.getScriptTimeZone(), 'MMMM dd, yyyy \'at\' hh:mm a z') +
        '</strong></p>' +
        '<table style="width:100%;border-collapse:collapse;font-size:14px;">' +
          '<thead>' +
            '<tr>' +
              '<th style="padding:8px 12px;background:#4d2f1d;color:#fff;text-align:left;border:1px solid #ddd;">Field</th>' +
              '<th style="padding:8px 12px;background:#4d2f1d;color:#fff;text-align:left;border:1px solid #ddd;">Answer</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' + rows + '</tbody>' +
        '</table>' +
      '</div>' +
    '</div>';

  var imageAttachments = createImageAttachments_(uploads);
  var attachments = [pdfAttachment].concat(imageAttachments);

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: subject,
    htmlBody: body,
    attachments: attachments
  });
}

// ─────────────────────────────────────────────────────────────────
//  Helper: escape HTML special chars in answer strings
// ─────────────────────────────────────────────────────────────────
function escapeHtml(text) {
  return String(text)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

function extractPayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('No payload received.');
  }

  return JSON.parse(e.postData.contents);
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function createImageAttachments_(uploads) {
  var attachments = [];

  for (var fieldName in uploads) {
    if (!uploads.hasOwnProperty(fieldName)) continue;

    var files = uploads[fieldName];
    if (!Array.isArray(files)) continue;

    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if (!file || !file.dataUrl || !file.name) continue;

      try {
        attachments.push(blobFromDataUrl_(file.dataUrl, file.name));
      } catch (error) {
        Logger.log('Skipping upload attachment "' + file.name + '": ' + error);
      }
    }
  }

  return attachments;
}

function getDriveFileUploadSummary_(responseValue, fieldTitle) {
  var attachments = [];
  var summaries = [];

  if (!Array.isArray(responseValue)) {
    responseValue = responseValue ? [responseValue] : [];
  }

  for (var i = 0; i < responseValue.length; i++) {
    var fileId = responseValue[i];
    if (!fileId) continue;

    try {
      var driveFile = DriveApp.getFileById(String(fileId));
      summaries.push(driveFile.getName());
      attachments.push(driveFile.getBlob().setName(driveFile.getName()));
    } catch (error) {
      Logger.log('Skipping Google Form upload for "' + fieldTitle + '" (' + fileId + '): ' + error);
    }
  }

  return {
    summary: summaries.length ? summaries.join(', ') : 'No uploaded files found',
    attachments: attachments
  };
}

function blobFromDataUrl_(dataUrl, fileName) {
  var matches = String(dataUrl).match(/^data:(.+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid data URL payload.');
  }

  var mimeType = matches[1];
  var bytes = Utilities.base64Decode(matches[2]);
  return Utilities.newBlob(bytes, mimeType, fileName);
}

function createEmailHeaderHtml_(subtitle) {
  var logoBlock = BRAND_LOGO_URL
    ? '<img src="' + BRAND_LOGO_URL + '" alt="Dreambuild Logo" style="max-height:56px;display:block;margin:0 0 16px;" />'
    : '';

  return '<div style="background:#8f6300;padding:24px;border-radius:10px 10px 0 0;">' +
           logoBlock +
           '<h2 style="color:#ffffff;margin:0;font-size:20px;">' + escapeHtml(subtitle) + '</h2>' +
         '</div>';
}

function createSubmissionPdf_(options) {
  var safeClientName = String(options.clientName || 'Client').replace(/[^\w\-]+/g, '_');
  var timestamp = Utilities.formatDate(options.submittedAt, Session.getScriptTimeZone(), 'yyyyMMdd_HHmm');

  var logoBlock = BRAND_LOGO_URL
    ? '<img src="' + BRAND_LOGO_URL + '" alt="Dreambuild Logo" style="max-height:62px;display:block;margin-bottom:16px;" />'
    : '<div style="display:inline-block;padding:12px 16px;border-radius:16px;background:#f7c948;color:#3e2a00;font-weight:bold;letter-spacing:0.18em;font-size:12px;margin-bottom:16px;">DREAMBUILD</div>';

  var pdfHtml =
    '<html>' +
      '<body style="font-family:Arial,sans-serif;color:#35270e;padding:28px;">' +
        '<div style="border-bottom:3px solid #f7c948;padding-bottom:18px;margin-bottom:24px;">' +
          logoBlock +
          '<h1 style="margin:0 0 8px;font-size:24px;">' + escapeHtml(options.title) + '</h1>' +
          '<p style="margin:0;color:#8f6300;font-size:14px;">' + escapeHtml(options.subtitle) + ' • ' + BRAND_VERSION + '</p>' +
          '<p style="margin:10px 0 0;color:#6f6258;font-size:13px;">Client: ' + escapeHtml(options.clientName || 'Not provided') + '</p>' +
          '<p style="margin:4px 0 0;color:#6f6258;font-size:13px;">Submitted: ' +
            Utilities.formatDate(options.submittedAt, Session.getScriptTimeZone(), 'MMMM dd, yyyy hh:mm a z') +
          '</p>' +
        '</div>' +
        '<table style="width:100%;border-collapse:collapse;font-size:13px;">' +
          '<thead>' +
            '<tr>' +
              '<th style="padding:10px 12px;background:#8f6300;color:#fff;text-align:left;border:1px solid #d9c89b;">Field</th>' +
              '<th style="padding:10px 12px;background:#8f6300;color:#fff;text-align:left;border:1px solid #d9c89b;">Answer</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' + options.rows + '</tbody>' +
        '</table>' +
      '</body>' +
    '</html>';

  return Utilities.newBlob(pdfHtml, 'text/html', 'dreambuild_submission.html')
    .getAs('application/pdf')
    .setName('Dreambuild_' + safeClientName + '_' + timestamp + '.pdf');
}
