# ✅ Master Class Certificate - Updated Design

## 🎨 **Professional Gold/Black Theme**

The Master Class certificate now includes all required information in a professional layout:

---

## 📋 **Certificate Layout:**

```
┌─────────────────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════════════════╗  │
│  ║                      [S]                          ║  │ ← Top badge
│  ║                                                   ║  │
│  ║              C E R T I F I C A T E               ║  │ ← Large white
│  ║               OF COMPLETION                       ║  │ ← Spaced
│  ║           MASTER CLASS ACHIEVEMENT                ║  │ ← Subtitle
│  ║                                                   ║  │
│  ║              ─────────────────                    ║  │ ← Decorative line
│  ║                                                   ║  │
│  ║            This certifies that                    ║  │ ← Small gray
│  ║                                                   ║  │
│  ║              Estelle Darcy                        ║  │ ← Large italic white
│  ║            ───────────────────                    ║  │ ← Gold underline
│  ║                                                   ║  │
│  ║            29 NOVEMBER, 2030                      ║  │ ← Date prominent
│  ║                                                   ║  │
│  ║  Has successfully completed the React Roadmap    ║  │
│  ║  Master Class. Demonstrating exceptional         ║  │ ← Description
│  ║  dedication, skill mastery, and professional      ║  │   paragraph
│  ║  excellence in the subject matter.                ║  │
│  ║                                                   ║  │
│  ║  ─────────────  [🏅]  ─────────────              ║  │ ← Gold seal
│  ║                                                   ║  │
│  ║  INSTRUCTOR              DIRECTOR                 ║  │
│  ║  ───────────             ───────────              ║  │
│  ║                                                   ║  │
│  ║  ─────────────────────────────────────────────   ║  │ ← Gold line
│  ║                                                   ║  │
│  ║  CERTIFICATE ID    DATE ISSUED      DURATION      ║  │ ← Gold labels
│  ║  CERT-2024-001     16 Feb 2026      2 Hours       ║  │ ← Gray values
│  ╚═══════════════════════════════════════════════════╝  │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 **Key Features:**

### **1. Header Section**
- ✅ Top decorative badge with "S" initial
- ✅ "CERTIFICATE" in large white letters (52pt, spaced)
- ✅ "OF COMPLETION" subtitle (11pt, spaced)
- ✅ "MASTER CLASS ACHIEVEMENT" in small gray

### **2. Main Content**
- ✅ "This certifies that" in small gray
- ✅ Recipient name in large elegant italic (56pt)
- ✅ Gold underline extending beyond name
- ✅ Date in prominent white (29 NOVEMBER, 2030)
- ✅ Multi-line description paragraph

### **3. Footer Section**
- ✅ Gold seal/badge with ribbon in center
- ✅ Horizontal gold lines on both sides
- ✅ "INSTRUCTOR" and "DIRECTOR" labels
- ✅ Signature lines above labels

### **4. Bottom Information Bar** ⭐ NEW!
- ✅ Thin gold separator line
- ✅ **CERTIFICATE ID** (left) - Gold label, gray value
- ✅ **DATE ISSUED** (center) - Gold label, gray value
- ✅ **DURATION** (right) - Gold label, gray value

---

## 🎨 **Color Palette:**

| Element | Color | Hex/RGB |
|---------|-------|---------|
| Background | Deep Black | `rgb(20, 20, 20)` |
| Borders | Rich Gold | `#d4af37` |
| Main Text | White | `#ffffff` |
| Descriptions | Light Gray | `rgb(180, 180, 180)` |
| Highlights | Light Gold | `rgb(255, 223, 128)` |

---

## 📊 **Data Fields Used:**

```javascript
{
  name: "Estelle Darcy",              // Recipient name
  webinar_title: "React Roadmap Master Class",  // Course name
  issued_date: "2030-11-29",          // Issue date
  certificate_id: "CERT-2024-001",    // Unique ID
  duration: "2 Hours"                 // Course duration ⭐ NEW!
}
```

---

## 🔧 **How to Pass Duration:**

When generating a certificate, include the `duration` field:

```javascript
const certificateData = {
  name: attendee.name,
  webinar_title: webinar.program_name,
  issued_date: new Date().toISOString(),
  certificate_id: certId,
  duration: "2 Hours"  // ⭐ Add this field
};

await generateCertificatePDF(certificateData);
```

---

## 🎯 **Default Values:**

If fields are not provided, these defaults are used:

- **Name**: "Estelle Darcy"
- **Date**: "29 NOVEMBER, 2030"
- **Certificate ID**: "CERT-2024-001"
- **Duration**: "2 Hours"

---

## ✅ **Certificate Types:**

| Type | Trigger | Theme | Bottom Bar |
|------|---------|-------|------------|
| **Master Class** | Title contains "master class" OR `certificate_type: 'completion'` | Gold/Black | ✅ ID, Date, Duration |
| **Webinar** | Any other | Pink/White | ❌ Simple footer |

---

## 🚀 **Next Steps:**

1. ✅ Certificate generation updated
2. ⏳ Update admin panel to allow entering duration when creating webinars
3. ⏳ Add duration field to webinars table (optional)
4. ⏳ Test certificate generation with real data

---

**The Master Class certificate now displays Certificate ID, Date, and Duration in a professional bottom bar!** 🎉✨
