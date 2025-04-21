import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    borderBottom: "2 solid #2c3e50",
    paddingBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 14,
  },
  hospitalInfo: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  hospitalName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 2,
  },
  hospitalTag: {
    fontSize: 11,
    color: "#1976d2",
    marginBottom: 2,
    fontWeight: "bold",
  },
  hospitalAddress: {
    fontSize: 10,
    color: "#555",
  },
  date: {
    fontSize: 11,
    color: "#222",
    textAlign: "right",
    marginLeft: 10,
  },
  section: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 6,
    boxShadow: "0 1px 2px #eee",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1976d2",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  infoLabel: {
    width: 120,
    fontWeight: "bold",
    color: "#333",
  },
  infoValue: {
    color: "#222",
    flex: 1,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#1976d2",
    marginTop: 10,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#1976d2",
    backgroundColor: "#e3f0fd",
    padding: 6,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#b3c6e7",
    padding: 6,
    textAlign: "center",
    fontSize: 11,
  },
  signatureSection: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  doctorBlock: {
    flex: 1,
  },
  doctorText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 2,
  },
  signatureLine: {
    width: 180,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    borderBottomStyle: "solid",
    marginBottom: 4,
    alignSelf: "flex-end",
  },
  signatureLabel: {
    fontSize: 10,
    color: "#555",
    textAlign: "right",
    marginRight: 8,
  },
});

const TreatmentPDF = ({ data, appointmentDetails }) => {
  // Use appointmentDetails for doctor, patient, date, etc.
  const today = new Date().toLocaleDateString();
  const appointmentDate = appointmentDetails?.date_time
    ? new Date(appointmentDetails.date_time).toLocaleDateString()
    : "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.logo} src={"/logo.png"} />
          <View style={styles.hospitalInfo}>
            <Text style={styles.hospitalName}>ArogyaMithra</Text>
            <Text style={styles.hospitalTag}>Your Trusted Health Care Partner</Text>
            <Text style={styles.hospitalAddress}>
              #123, Main Road, Hyderabad, Telangana, India | Phone: 12345 67890 | www.arogyamithra.com
            </Text>
          </View>
          <Text style={styles.date}>Date: {today}</Text>
        </View>

        <Text style={{ fontSize: 16, textAlign: "center", marginVertical: 10, fontWeight: "bold", color: "#1976d2" }}>
          Hospital Prescription
        </Text>

        {/* Patient/Treatment Info */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Appointment ID:</Text>
            <Text style={styles.infoValue}>{data.appointment_id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Patient Name:</Text>
            <Text style={styles.infoValue}>
              {appointmentDetails?.patient?.name || data.patient_name}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Doctor Name:</Text>
            <Text style={styles.infoValue}>
              {appointmentDetails?.name || "Dr. A. Sharma"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Appointment Date:</Text>
            <Text style={styles.infoValue}>{appointmentDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Reason / Notes:</Text>
            <Text style={styles.infoValue}>{appointmentDetails?.notes || ""}</Text>
          </View>
          {appointmentDetails?.patient.age && appointmentDetails?.patient.gender && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Age / Gender:</Text>
              <Text style={styles.infoValue}>
                {appointmentDetails?.patient.age} / {appointmentDetails?.patient.gender}
              </Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Diagnosis:</Text>
            <Text style={styles.infoValue}>{data.diagnosis}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Treatment Plan:</Text>
            <Text style={styles.infoValue}>{data.treatment_plan}</Text>
          </View>
        </View>

        {/* Medications Table */}
        <View style={styles.section}>
          <Text style={styles.label}>Medications:</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Medicine</Text>
              <Text style={styles.tableColHeader}>Dosage</Text>
              <Text style={styles.tableColHeader}>Frequency</Text>
              <Text style={styles.tableColHeader}>Duration</Text>
            </View>
            {data.medications.map((med, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCol}>{med.medicine_name}</Text>
                <Text style={styles.tableCol}>{med.dosage}</Text>
                <Text style={styles.tableCol}>{med.frequency}</Text>
                <Text style={styles.tableCol}>{med.duration}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Additional Instructions */}
        {data.instructions && (
          <View style={styles.section}>
            <Text style={styles.label}>Additional Instructions:</Text>
            <Text style={{ color: "#444" }}>{data.instructions}</Text>
          </View>
        )}

        {/* Doctor Info & Signature */}
        <View style={styles.signatureSection}>
          <View style={styles.doctorBlock}>
            <Text style={styles.doctorText}>
              Doctor: {appointmentDetails?.name || "Dr. A. Sharma"}
            </Text>
            <Text style={styles.doctorText}>Department: {appointmentDetails?.specialization || "General Medicine"}</Text>
            <Text style={styles.doctorText}>Registration No: {appointmentDetails?.hcp_id || 123456789}</Text>
          </View>
          <View>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Doctor's Signature</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TreatmentPDF;
