import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 12,
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
  },
  row: {
    marginBottom: 6,
  },
});

// Component
const BillingPDF = ({ hospital, patient, billing }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        {hospital.logoUrl && (
          <Image style={styles.logo} src={hospital.logoUrl} />
        )}
        <Text style={styles.title}>{hospital.name}</Text>
        <Text style={styles.subTitle}>{hospital.address}</Text>
        <Text style={{ fontSize: 10, color: '#888' }}>{hospital.contact}</Text>
        {hospital.website && (
          <Text style={{ fontSize: 10, color: '#888' }}>{hospital.website}</Text>
        )}
      </View>

      {/* Patient Details */}
      <View style={styles.section}>
        <Text
          style={{
            fontSize: 14,
            marginBottom: 10,
            textDecoration: 'underline',
          }}
        >
          Patient Details
        </Text>
        <Text style={styles.row}><Text style={styles.label}>Name:</Text> {patient.name}</Text>
        <Text style={styles.row}><Text style={styles.label}>Email:</Text> {patient.email}</Text>
        <Text style={styles.row}><Text style={styles.label}>Contact:</Text> {patient.contact}</Text>
        <Text style={styles.row}><Text style={styles.label}>Address:</Text> {patient.address}</Text>
        <Text style={styles.row}><Text style={styles.label}>Gender:</Text> {patient.gender}</Text>
        <Text style={styles.row}><Text style={styles.label}>Patient ID:</Text> {patient.patient_id}</Text>
        <Text style={styles.row}><Text style={styles.label}>Admission ID:</Text> {patient.admission_id}</Text>
        <Text style={styles.row}><Text style={styles.label}>Admit Date:</Text> {new Date(patient.admit_date).toLocaleString()}</Text>
        <Text style={styles.row}><Text style={styles.label}>Discharge Date:</Text> {new Date(patient.discharge_date).toLocaleString()}</Text>
      </View>

      {/* Billing Info */}
      <View style={styles.section}>
        <Text
          style={{
            fontSize: 14,
            marginBottom: 10,
            textDecoration: 'underline',
          }}
        >
          Billing Summary
        </Text>
        <Text style={styles.row}><Text style={styles.label}>Total Fees:</Text> ₹{billing.total_fees}</Text>
        <Text style={styles.row}><Text style={styles.label}>Fee Paid:</Text> ₹{billing.fee_paid}</Text>
        <Text style={styles.row}><Text style={styles.label}>Remaining Fees:</Text> ₹{billing.remaining_fees}</Text>

        <Text style={[styles.label, { marginTop: 10, marginBottom: 4 }]}>
          Fee Paid Details (Raw JSON):
        </Text>
        <Text style={styles.row}>
          {JSON.stringify(patient.fee_paid_details, null, 2)}
        </Text>
      </View>

      {/* Discharge Confirmation */}
      <View style={[styles.section, { alignItems: 'center', marginTop: 30 }]}>
        <Text style={{ fontSize: 16, color: '#2e7d32', fontWeight: 'bold', marginBottom: 8 }}>
          ✅ Discharged Successfully
        </Text>

        <View
          style={{
            border: '1pt solid #000',
            padding: 10,
            width: '60%',
            marginTop: 10,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Authorized Signature</Text>
          <Text style={{ fontSize: 10, marginTop: 20 }}>__________________________</Text>
          <Text style={{ fontSize: 10, marginTop: 4 }}>{hospital.name} Administration</Text>
          <Text style={{ fontSize: 10, marginTop: 4 }}>
            Date: {new Date().toLocaleDateString()}
          </Text>
        </View>

        <Text style={{ fontSize: 8, color: '#888', marginTop: 10 }}>
          This is a computer-generated discharge summary. No physical signature is required.
        </Text>

        {/* Optional QR Code */}
        {hospital.qrCodeUrl && (
          <Image
            src={hospital.qrCodeUrl}
            style={{ width: 80, height: 80, marginTop: 10 }}
          />
        )}
      </View>

      {/* Footer */}
      <Text style={{ marginTop: 30, textAlign: 'center', fontSize: 10 }}>
        Thank you for choosing {hospital.name}. We wish you a speedy recovery!
      </Text>
    </Page>
  </Document>
);

export default BillingPDF;
