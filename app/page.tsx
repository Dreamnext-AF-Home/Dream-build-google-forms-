"use client";

import Image from "next/image";
import { ChangeEvent, DragEvent, FormEvent, useMemo, useState } from "react";

type BaseField = {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
};

type UploadedImage = {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
};

type Field =
  | (BaseField & {
      type: "text" | "email" | "tel" | "date" | "number";
    })
  | (BaseField & {
      type: "textarea";
    })
  | (BaseField & {
      type: "radio";
      options: string[];
    })
  | (BaseField & {
      type: "checkbox-group";
      options: string[];
    })
  | (BaseField & {
      type: "file-upload";
      accept?: string;
      maxFiles?: number;
    });

type Group = {
  title: string;
  fields: Field[];
};

type Section = {
  page: string;
  title: string;
  description: string;
  groups: Group[];
};

type SubmitState = {
  type: "idle" | "success" | "error";
  message: string;
};

type FormValue = string | string[] | UploadedImage[];
type FormValues = Record<string, FormValue>;

const sectionChips = [
  "Client profile",
  "Project scope",
  "Budget and style",
  "Site and submission",
  "Review and terms",
];

const sections: Section[] = [
  {
    page: "Page 1 of 4",
    title: "Client Information",
    description: "Please provide your personal and contact details.",
    groups: [
      {
        title: "Primary Contact",
        fields: [
          { type: "text", label: "Client Full Name", name: "clientFullName", required: true },
          { type: "text", label: "Company Name (if any)", name: "companyName" },
          { type: "tel", label: "Mobile Number", name: "mobileNumber", required: true },
          { type: "tel", label: "Viber / WhatsApp Number", name: "viberWhatsapp" },
          { type: "email", label: "Email Address", name: "emailAddress", required: true },
          {
            type: "checkbox-group",
            label: "Preferred Contact Method",
            name: "preferredContactMethod",
            required: true,
            options: ["Call", "Viber", "WhatsApp", "Email"],
          },
          { type: "textarea", label: "Residential Address", name: "residentialAddress" },
          { type: "text", label: "City / Barangay", name: "cityBarangay" },
          { type: "text", label: "Nationality", name: "nationality" },
          { type: "text", label: "Valid ID Type and Number", name: "validId" },
        ],
      },
      {
        title: "Secondary Contact / Authorized Representative",
        fields: [
          { type: "text", label: "Representative Full Name", name: "repFullName" },
          { type: "text", label: "Relationship to Client", name: "repRelationship" },
          { type: "tel", label: "Representative Mobile Number", name: "repMobile" },
          { type: "email", label: "Representative Email Address", name: "repEmail" },
        ],
      },
    ],
  },
  {
    page: "Page 2 of 4",
    title: "Project And Household Details",
    description: "Share the property details, household setup, and spaces included in the scope.",
    groups: [
      {
        title: "Project Information",
        fields: [
          { type: "text", label: "Project Name / Reference", name: "projectReference" },
          { type: "textarea", label: "Project Address", name: "projectAddress", required: true },
          {
            type: "checkbox-group",
            label: "Property Type",
            name: "propertyType",
            required: true,
            options: ["House", "Condominium", "Office", "Commercial Space", "Other"],
          },
          {
            type: "checkbox-group",
            label: "Project Type",
            name: "projectType",
            required: true,
            options: ["New Build", "Renovation", "Interior Fit-out", "Consultation Only"],
          },
          { type: "number", label: "Floor Area (sqm)", name: "floorArea" },
          { type: "number", label: "Number of Floors", name: "numberOfFloors" },
          {
            type: "radio",
            label: "Current Status of Property",
            name: "propertyStatus",
            required: true,
            options: ["Bare", "Existing Occupied Space", "Turnover Pending", "Under Construction"],
          },
          { type: "date", label: "Target Move-in / Turnover Date", name: "moveInDate" },
          {
            type: "radio",
            label: "Is the property owned or leased?",
            name: "propertyOwnership",
            options: ["Owned", "Leased"],
          },
        ],
      },
      {
        title: "Household / User Profile",
        fields: [
          { type: "number", label: "Number of Adults", name: "numberOfAdults" },
          { type: "text", label: "Children (with ages)", name: "childrenAges" },
          {
            type: "radio",
            label: "Elderly in household?",
            name: "elderlyInHousehold",
            options: ["Yes", "No"],
          },
          {
            type: "radio",
            label: "Persons with disability / accessibility needs?",
            name: "accessibilityNeeds",
            options: ["Yes", "No"],
          },
          { type: "textarea", label: "Daily lifestyle / routine notes", name: "dailyLifestyle" },
          { type: "textarea", label: "Storage needs or special requirements", name: "storageNeeds" },
        ],
      },
      {
        title: "Scope Of Work",
        fields: [
          {
            type: "checkbox-group",
            label: "Please check all spaces included in the project",
            name: "spacesIncluded",
            required: true,
            options: [
              "Living Room",
              "Dining Area",
              "Kitchen",
              "Master Bedroom",
              "Bedroom 2",
              "Bedroom 3",
              "Toilet and Bath",
              "Powder Room",
              "Home Office / Study",
              "Entertainment Area",
              "Balcony / Terrace",
              "Laundry / Utility Area",
              "Storage Room",
              "Commercial Reception Area",
              "Workstations / Office Area",
              "Other",
            ],
          },
          { type: "text", label: "Other space (please specify)", name: "otherSpace" },
        ],
      },
    ],
  },
  {
    page: "Page 3 of 4",
    title: "Budget, Timeline And Design Preferences",
    description: "Help Dreambuild align the proposal with your priorities, style, and timeline.",
    groups: [
      {
        title: "Budget And Timeline",
        fields: [
          { type: "text", label: "Estimated Total Budget (PHP)", name: "estimatedBudget", required: true },
          { type: "text", label: "Design Fee Budget (if applicable)", name: "designFeeBudget" },
          { type: "text", label: "Construction / Fit-out Budget", name: "fitOutBudget" },
          { type: "text", label: "Furniture and Decor Budget", name: "furnitureBudget" },
          {
            type: "radio",
            label: "Budget Flexibility",
            name: "budgetFlexibility",
            required: true,
            options: ["Fixed", "Flexible within 10%", "Flexible depending on proposal"],
          },
          { type: "date", label: "Desired Project Start Date", name: "projectStartDate" },
          { type: "date", label: "Desired Completion Date", name: "completionDate" },
          {
            type: "radio",
            label: "Timeline Priority",
            name: "timelinePriority",
            required: true,
            options: ["Fast Completion", "Balanced", "Quality First"],
          },
          {
            type: "radio",
            label: "Main Decision Driver",
            name: "decisionDriver",
            required: true,
            options: ["Budget", "Design Quality", "Function", "Timeline"],
          },
        ],
      },
      {
        title: "Design Preferences",
        fields: [
          {
            type: "checkbox-group",
            label: "Preferred Style",
            name: "preferredStyle",
            required: true,
            options: [
              "Modern",
              "Contemporary",
              "Minimalist",
              "Scandinavian",
              "Industrial",
              "Japandi",
              "Classic",
              "Luxury",
              "Tropical",
              "Eclectic",
              "Other",
            ],
          },
          { type: "text", label: "Other style (please specify)", name: "otherStyle" },
          { type: "text", label: "Preferred Colours", name: "preferredColours" },
          { type: "text", label: "Colours to Avoid", name: "coloursToAvoid" },
          { type: "text", label: "Preferred Wall Finish", name: "wallFinish" },
          { type: "text", label: "Preferred Flooring", name: "preferredFlooring" },
          { type: "text", label: "Preferred Cabinet Finish", name: "cabinetFinish" },
          { type: "text", label: "Preferred Countertop Material", name: "countertopMaterial" },
          { type: "text", label: "Preferred Hardware Finish", name: "hardwareFinish" },
          { type: "text", label: "Materials / Finishes to Avoid", name: "materialsToAvoid" },
          {
            type: "textarea",
            label: "Pinterest / Mood Board Links",
            name: "moodBoardLinks",
            helperText: "Optional. You can type links here and/or upload images below.",
          },
          {
            type: "file-upload",
            label: "Upload Pinterest / Mood Board Images",
            name: "moodBoardImages",
            accept: "image/*",
            maxFiles: 6,
            helperText: "Optional. Drag and drop images here or click to upload up to 6 files.",
          },
          {
            type: "textarea",
            label: "Pegs / Inspirations from social media or websites",
            name: "pegsInspirations",
            helperText: "Optional. You can type notes here and/or upload images below.",
          },
          {
            type: "file-upload",
            label: "Upload Pegs / Inspiration Images",
            name: "pegsInspirationImages",
            accept: "image/*",
            maxFiles: 6,
            helperText: "Optional. Drag and drop images here or click to upload up to 6 files.",
          },
          {
            type: "textarea",
            label: "Existing furniture or decor to retain",
            name: "existingFurniture",
            helperText: "Optional. You can describe the items here and/or upload images below.",
          },
          {
            type: "file-upload",
            label: "Upload Existing Furniture / Decor Images",
            name: "existingFurnitureImages",
            accept: "image/*",
            maxFiles: 6,
            helperText: "Optional. Drag and drop images here or click to upload up to 6 files.",
          },
        ],
      },
    ],
  },
  {
    page: "Page 4 of 4",
    title: "Site, Commercial Terms, And Submission",
    description: "Wrap up site logistics, commercial terms, and the final checklist before submission.",
    groups: [
      {
        title: "Site Assessment",
        fields: [
          {
            type: "radio",
            label: "Site Visit Required?",
            name: "siteVisitRequired",
            required: true,
            options: ["Yes", "No"],
          },
          { type: "date", label: "Preferred Site Visit Date", name: "siteVisitDate" },
          { type: "text", label: "Best Time for Visit", name: "visitTime" },
          {
            type: "radio",
            label: "Existing Plans Available?",
            name: "existingPlansAvailable",
            options: ["Yes", "No"],
          },
          {
            type: "checkbox-group",
            label: "If yes, available documents",
            name: "availableDocuments",
            options: ["Floor Plan", "As-built Plan", "Electrical Plan", "Plumbing Plan", "Ceiling Plan"],
          },
          { type: "textarea", label: "Site restrictions / building admin requirements", name: "siteRestrictions" },
          { type: "text", label: "Parking / delivery restrictions", name: "parkingRestrictions" },
          { type: "text", label: "Work hour limitations", name: "workHourLimitations" },
        ],
      },
      {
        title: "Commercial Terms",
        fields: [
          {
            type: "checkbox-group",
            label: "Service Required",
            name: "serviceRequired",
            required: true,
            options: [
              "Design Consultation Only",
              "Design + Procurement",
              "Full Design and Build",
              "Fit-out Only",
            ],
          },
          { type: "text", label: "Preferred Payment Arrangement", name: "paymentArrangement" },
          { type: "text", label: "Billing Name / Company Name", name: "billingName" },
          { type: "textarea", label: "Billing Address", name: "billingAddress" },
          {
            type: "radio",
            label: "VAT Requirement",
            name: "vatRequirement",
            options: ["Yes", "No"],
          },
          { type: "text", label: "Official Receipt / Invoice Details", name: "invoiceDetails" },
        ],
      },
      {
        title: "Communication And Approval Process",
        fields: [
          { type: "text", label: "Primary decision maker", name: "decisionMaker" },
          { type: "text", label: "Who approves design proposals?", name: "designApprover" },
          { type: "text", label: "Who approves budget revisions?", name: "budgetApprover" },
          {
            type: "radio",
            label: "Preferred meeting mode",
            name: "meetingMode",
            options: ["Face-to-face", "Video Call", "Phone Call"],
          },
          {
            type: "text",
            label: "Preferred schedule for updates (e.g. every Friday, weekly)",
            name: "updateSchedule",
          },
          {
            type: "checkbox-group",
            label: "Preferred channel for file sharing",
            name: "fileSharingChannel",
            options: ["Email", "Viber", "WhatsApp", "Google Drive"],
          },
        ],
      },
      {
        title: "Submission Checklist And Acknowledgment",
        fields: [
          {
            type: "checkbox-group",
            label: "Please confirm which documents you are submitting",
            name: "submissionDocuments",
            options: [
              "Copy of valid ID",
              "Floor plan / as-built drawing",
              "Photos / videos of existing site",
              "Pegs / inspiration images",
              "Condominium / building guidelines",
              "Target budget range",
              "Other relevant technical documents",
            ],
          },
          { type: "textarea", label: "Notes and Special Instructions", name: "specialInstructions" },
          {
            type: "text",
            label: "Client Full Name (for acknowledgment)",
            name: "acknowledgmentName",
            required: true,
          },
          { type: "date", label: "Date of Submission", name: "submissionDate", required: true },
        ],
      },
    ],
  },
];

const initialValues = sections.reduce<FormValues>((acc, section) => {
  section.groups.forEach((group) => {
    group.fields.forEach((field) => {
      acc[field.name] = field.type === "checkbox-group" || field.type === "file-upload" ? [] : "";
    });
  });
  return acc;
}, {});

function isUploadedImageArray(value: FormValue): value is UploadedImage[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === "object" && item !== null && "dataUrl" in item)
  );
}

function getDisplayValue(value: FormValue) {
  if (isUploadedImageArray(value)) {
    return value.length ? value.map((file) => file.name).join(", ") : "No images uploaded";
  }

  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "Not provided";
  }

  return value ? value : "Not provided";
}

function buildSubmissionPayload(values: FormValues) {
  const sectionsPayload: Record<string, Record<string, string | string[]>> = {};
  const uploadsPayload: Record<string, UploadedImage[]> = {};

  sections.forEach((section) => {
    section.groups.forEach((group) => {
      const groupPayload: Record<string, string | string[]> = {};

      group.fields.forEach((field) => {
        const value = values[field.name];

        if (isUploadedImageArray(value)) {
          groupPayload[field.label] = value.map((file) => file.name);
          uploadsPayload[field.name] = value;
          return;
        }

        groupPayload[field.label] = value;
      });

      sectionsPayload[group.title] = groupPayload;
    });
  });

  return {
    submittedFrom: "Dreambuild Next.js onboarding form",
    clientFullName: String(values.clientFullName || ""),
    acknowledgmentName: String(values.acknowledgmentName || ""),
    emailAddress: String(values.emailAddress || ""),
    sections: sectionsPayload,
    uploads: uploadsPayload,
    rawValues: values,
  };
}

function isFieldFilled(field: Field, values: FormValues) {
  const value = values[field.name];

  if (!field.required) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return String(value || "").trim().length > 0;
}

function getFirstMissingField(section: Section, values: FormValues) {
  for (const group of section.groups) {
    for (const field of group.fields) {
      if (!isFieldFilled(field, values)) {
        return field;
      }
    }
  }

  return null;
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function readFileAsDataUrl(file: File) {
  return new Promise<UploadedImage>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error(`Unable to read ${file.name}.`));
        return;
      }

      resolve({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl: reader.result,
      });
    };

    reader.onerror = () => reject(new Error(`Unable to read ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [dragFieldName, setDragFieldName] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>({
    type: "idle",
    message: "",
  });

  const totalSteps = sections.length + 1;
  const isReviewStep = currentStep === sections.length;
  const currentSection = sections[currentStep];

  const currentStepValid = useMemo(() => {
    if (isReviewStep) {
      return termsAccepted;
    }

    return currentSection.groups.every((group) =>
      group.fields.every((field) => isFieldFilled(field, values)),
    );
  }, [currentSection, isReviewStep, termsAccepted, values]);

  function scrollToField(fieldName: string) {
    if (typeof document === "undefined") {
      return;
    }

    const target = document.querySelector<HTMLElement>(`[data-field-name="${fieldName}"]`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });

      const input = target.querySelector<HTMLInputElement | HTMLTextAreaElement>("input, textarea");
      input?.focus();
    }
  }

  function scrollToTerms() {
    if (typeof document === "undefined") {
      return;
    }

    const target = document.querySelector<HTMLElement>("[data-terms-card]");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function updateValue(field: Field, nextValue: string | string[] | UploadedImage[]) {
    setValues((current) => ({
      ...current,
      [field.name]: nextValue,
    }));
  }

  async function handleFilesSelected(field: Extract<Field, { type: "file-upload" }>, fileList: FileList | null) {
    if (!fileList?.length) {
      return;
    }

    const maxFiles = field.maxFiles ?? 6;
    const selectedFiles = Array.from(fileList).filter((file) => file.type.startsWith("image/"));

    if (!selectedFiles.length) {
      setSubmitState({
        type: "error",
        message: "Please upload image files only.",
      });
      return;
    }

    if (selectedFiles.length > maxFiles) {
      setSubmitState({
        type: "error",
        message: `You can upload up to ${maxFiles} images only.`,
      });
      return;
    }

    try {
      const uploadedImages = await Promise.all(selectedFiles.map((file) => readFileAsDataUrl(file)));
      setValues((current) => ({
        ...current,
        [field.name]: uploadedImages,
      }));
      setSubmitState({ type: "idle", message: "" });
    } catch (error) {
      setSubmitState({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to upload images.",
      });
    }
  }

  function removeUploadedImage(fieldName: string, imageName: string) {
    setValues((current) => {
      const currentFiles = current[fieldName];
      if (!isUploadedImageArray(currentFiles)) {
        return current;
      }

      return {
        ...current,
        [fieldName]: currentFiles.filter((file) => file.name !== imageName),
      };
    });
  }

  function renderSummaryValue(field: Field) {
    const value = values[field.name];

    if (field.type === "file-upload") {
      const uploadedFiles: UploadedImage[] = isUploadedImageArray(value) ? value : [];

      if (!uploadedFiles.length) {
        return <strong>No images uploaded</strong>;
      }

      return (
        <div className="summary-upload-list">
          {uploadedFiles.map((file) => (
            <div className="summary-upload-item" key={file.name}>
              <strong>{file.name}</strong>
              <span>{formatFileSize(file.size)}</span>
            </div>
          ))}
        </div>
      );
    }

    return <strong>{getDisplayValue(value)}</strong>;
  }

  function renderField(field: Field) {
    const fieldClassName =
      field.type === "textarea" || field.type === "radio" || field.type === "checkbox-group" || field.type === "file-upload"
        ? "form-field field-span-full"
        : "form-field";

    if (field.type === "textarea") {
      return (
        <label className={fieldClassName} key={field.name} data-field-name={field.name}>
          <span>
            {field.label}
            {field.required ? <strong className="required-mark"> *</strong> : null}
          </span>
          {field.helperText ? <p className="field-help">{field.helperText}</p> : null}
          <textarea
            name={field.name}
            required={field.required}
            placeholder={field.placeholder}
            rows={4}
            value={String(values[field.name] || "")}
            onChange={(event) => updateValue(field, event.target.value)}
          />
        </label>
      );
    }

    if (field.type === "file-upload") {
      const uploadedFiles: UploadedImage[] = isUploadedImageArray(values[field.name])
        ? values[field.name]
        : [];
      const dropzoneActive = dragFieldName === field.name;

      return (
        <div className={fieldClassName} key={field.name} data-field-name={field.name}>
          <span>
            {field.label}
            {field.required ? <strong className="required-mark"> *</strong> : null}
          </span>
          {field.helperText ? <p className="field-help">{field.helperText}</p> : null}
          <div
            className={`upload-dropzone ${dropzoneActive ? "upload-dropzone-active" : ""}`}
            onDragEnter={(event: DragEvent<HTMLDivElement>) => {
              event.preventDefault();
              setDragFieldName(field.name);
            }}
            onDragOver={(event: DragEvent<HTMLDivElement>) => {
              event.preventDefault();
              setDragFieldName(field.name);
            }}
            onDragLeave={(event: DragEvent<HTMLDivElement>) => {
              event.preventDefault();
              if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
                return;
              }
              setDragFieldName((current) => (current === field.name ? null : current));
            }}
            onDrop={(event: DragEvent<HTMLDivElement>) => {
              event.preventDefault();
              setDragFieldName(null);
              void handleFilesSelected(field, event.dataTransfer.files);
            }}
          >
            <input
              id={field.name}
              className="sr-only-input"
              type="file"
              accept={field.accept ?? "image/*"}
              multiple={(field.maxFiles ?? 1) > 1}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                void handleFilesSelected(field, event.target.files);
                event.target.value = "";
              }}
            />
            <label className="upload-dropzone-inner" htmlFor={field.name}>
              <strong>Drag and drop image here</strong>
              <span>or click to upload</span>
            </label>
          </div>

          {uploadedFiles.length ? (
            <div className="upload-preview-grid">
              {uploadedFiles.map((file) => (
                <div className="upload-preview-card" key={file.name}>
                  <div className="upload-preview-image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={file.dataUrl} alt={file.name} />
                  </div>
                  <div className="upload-preview-meta">
                    <strong>{file.name}</strong>
                    <span>{formatFileSize(file.size)}</span>
                  </div>
                  <button
                    type="button"
                    className="upload-remove"
                    onClick={() => removeUploadedImage(field.name, file.name)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      );
    }

    if (field.type === "radio" || field.type === "checkbox-group") {
      return (
        <fieldset className={`${fieldClassName} choice-field`} key={field.name} data-field-name={field.name}>
          <legend>
            {field.label}
            {field.required ? <strong className="required-mark"> *</strong> : null}
          </legend>
          <div className="choice-grid">
            {field.options.map((option) => {
              const currentValue = values[field.name];
              const checked =
                field.type === "radio"
                  ? currentValue === option
                  : Array.isArray(currentValue) && currentValue.includes(option);

              return (
                <label className="choice-chip" key={option}>
                  <input
                    type={field.type === "radio" ? "radio" : "checkbox"}
                    name={field.name}
                    value={option}
                    checked={checked}
                    onChange={(event) => {
                      if (field.type === "radio") {
                        updateValue(field, event.target.value);
                        return;
                      }

                      const previous = Array.isArray(values[field.name]) ? [...values[field.name]] : [];
                      const next = event.target.checked
                        ? [...previous, option]
                        : previous.filter((item) => item !== option);
                      updateValue(field, next);
                    }}
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      );
    }

    return (
      <label className={fieldClassName} key={field.name} data-field-name={field.name}>
        <span>
          {field.label}
          {field.required ? <strong className="required-mark"> *</strong> : null}
        </span>
        <input
          type={field.type}
          name={field.name}
          required={field.required}
          placeholder={field.placeholder}
          value={String(values[field.name] || "")}
          onChange={(event) => updateValue(field, event.target.value)}
        />
      </label>
    );
  }

  function goNext() {
    if (!currentStepValid) {
      const missingField = getFirstMissingField(currentSection, values);
      setSubmitState({
        type: "error",
        message: "Please complete the required fields on this page first.",
      });

      if (missingField) {
        scrollToField(missingField.name);
      }
      return;
    }

    setSubmitState({ type: "idle", message: "" });
    setCurrentStep((step) => Math.min(step + 1, totalSteps - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setSubmitState({ type: "idle", message: "" });
    setCurrentStep((step) => Math.max(step - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetFormFlow() {
    setValues(initialValues);
    setTermsAccepted(false);
    setCurrentStep(0);
    setShowSuccessModal(false);
    setSubmitState({ type: "idle", message: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isReviewStep || !termsAccepted) {
      setSubmitState({
        type: "error",
        message: "Please review the summary and accept the terms before submitting.",
      });
      scrollToTerms();
      return;
    }

    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildSubmissionPayload(values)),
      });

      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Submission failed.");
      }

      setSubmitState({
        type: "success",
        message: result.message || "Submission sent successfully.",
      });
      setShowSuccessModal(true);
    } catch (error) {
      setSubmitState({
        type: "error",
        message: error instanceof Error ? error.message : "Submission failed.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="form-hero">
        <div className="hero-copy">
          <div className="hero-brand-lockup" aria-label="Dreambuild logo">
            <div className="hero-brand-image">
              <Image
                src="/Images/6059929002317038382.jpg"
                alt="Dreambuild logo"
                fill
                sizes="(max-width: 640px) 180px, 260px"
                priority
              />
            </div>
          </div>
          <p className="eyebrow">Dreambuild Design Studio</p>
          <h1>Client Onboarding Form</h1>
          <p className="hero-text">
            Complete the project brief one step at a time, review everything on the last page, and submit once you
            agree to the terms and conditions.
          </p>
        </div>

        <aside className="hero-panel">
          <p className="panel-label">Submission Notes</p>
          <ul>
            <li>One section per page for a cleaner experience.</li>
            <li>Last page includes a summary review before sending.</li>
            <li>Email notifications will go to `rnd001.apsara@gmail.com`.</li>
          </ul>
        </aside>
      </section>

      <section className="form-overview">
        <div className="overview-strip">
          {sectionChips.map((chip, index) => (
            <div className={`overview-chip ${index === currentStep ? "overview-chip-active" : ""}`} key={chip}>
              <span>{index + 1}</span>
              <strong>{chip}</strong>
            </div>
          ))}
        </div>
      </section>

      <form className="dream-form" onSubmit={handleSubmit}>
        {!isReviewStep ? (
          <section className="form-section">
            <div className="section-heading">
              <p className="section-tag">
                {currentSection.page} | Step {currentStep + 1} of {totalSteps}
              </p>
              <h2>{currentSection.title}</h2>
              <p className="section-copy">{currentSection.description}</p>
            </div>

            <div className="section-groups">
              {currentSection.groups.map((group) => (
                <article className="group-card" key={group.title}>
                  <h3>{group.title}</h3>
                  <div className="field-grid">{group.fields.map((field) => renderField(field))}</div>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <section className="form-section">
            <div className="section-heading">
              <p className="section-tag">Final Page | Step {totalSteps} of {totalSteps}</p>
              <h2>Review Summary And Terms</h2>
              <p className="section-copy">
                Check your answers below before submission. Once approved, this will be emailed to the Dreambuild team.
              </p>
            </div>

            <div className="section-groups">
              {sections.map((section) => (
                <article className="group-card" key={section.title}>
                  <h3>{section.title}</h3>
                  <div className="summary-grid">
                    {section.groups.map((group) => (
                      <div className="summary-block" key={group.title}>
                        <h4>{group.title}</h4>
                        <div className="summary-list">
                          {group.fields.map((field) => (
                            <div className="summary-row" key={field.name}>
                              <span>{field.label}</span>
                              {renderSummaryValue(field)}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}

              <article className="group-card terms-card" data-terms-card>
                <h3>Terms And Conditions</h3>
                <ul className="terms-list">
                  <li>You confirm that the information provided is accurate and complete to the best of your knowledge.</li>
                  <li>You authorize Dreambuild Design Studio to use this information for project review, quotation, and coordination.</li>
                  <li>You understand that submission of this form does not automatically confirm project acceptance or scheduling.</li>
                  <li>You agree that Dreambuild may contact you using the communication details you provided.</li>
                </ul>

                <label className="terms-check">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(event) => setTermsAccepted(event.target.checked)}
                  />
                  <span>I have reviewed the summary above and I agree to the terms and conditions.</span>
                </label>
              </article>
            </div>
          </section>
        )}

        <section className="submit-panel">
          <div>
            <p className="section-tag">
              {isReviewStep ? "Submit" : "Navigation"}
            </p>
            <h2>{isReviewStep ? "Ready for submission" : "Continue the onboarding flow"}</h2>
            <p className="section-copy">
              {isReviewStep
                ? "Submit only after you confirm the summary and accept the terms."
                : "Use next and back to move through the form one page at a time."}
            </p>
            {submitState.type !== "idle" ? (
              <p className={`submit-status submit-status-${submitState.type}`}>{submitState.message}</p>
            ) : null}
          </div>

          <div className="submit-actions">
            <button
              type="button"
              className="secondary-action"
              onClick={goBack}
              disabled={currentStep === 0 || isSubmitting}
            >
              Back
            </button>

            {!isReviewStep ? (
              <button type="button" className="primary-action" onClick={goNext}>
                Next page
              </button>
            ) : (
              <button type="submit" className="primary-action" disabled={isSubmitting || !termsAccepted}>
                {isSubmitting ? "Sending..." : "Submit onboarding form"}
              </button>
            )}
          </div>
        </section>
      </form>

      {showSuccessModal ? (
        <div className="success-modal-backdrop" role="presentation">
          <div
            className="success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-modal-title"
          >
            <div className="success-modal-badge">Form submitted</div>
            <h2 id="success-modal-title">Your response has been recorded.</h2>
            <p>
              Thank you for completing the Dreambuild client onboarding form.
              Our team will review your details and the submission has been sent
              to `rnd001.apsara@gmail.com`.
            </p>
            <div className="success-modal-actions">
              <button type="button" className="secondary-action" onClick={() => setShowSuccessModal(false)}>
                Close
              </button>
              <button type="button" className="primary-action" onClick={resetFormFlow}>
                Submit another response
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
