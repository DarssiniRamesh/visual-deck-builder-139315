import React from 'react';
import '../components/workflow.css';
import './useCaseFlow.css';

/**
 * PUBLIC_INTERFACE
 * UseCaseFlow
 * ------------
 * A clean, dedicated page that presents exactly three real verification flows
 * with ample spacing, larger targets, and all content fully visible.
 * The flows are:
 * 1) University Admission Verification
 * 2) Employment Document Verification
 * 3) Bank Loan Application Verification
 *
 * The page deliberately includes:
 * - Only the flows and relevant labels/arrows
 * - No legends, no unrelated icons, no placeholders
 * - A polished, modern style that aligns with brand tokens defined in workflow.css
 */
// PUBLIC_INTERFACE
export default function UseCaseFlow() {
  const flows = [
    {
      id: 1,
      title: 'University Admission Verification',
      issuer: 'CXC (CAPE / CSEC)',
      verifier: 'University Admission Offices',
      leftStep: 'Issue to Wallet',
      rightStep: 'Present / Verify',
    },
    {
      id: 2,
      title: 'Employment Document Verification',
      issuer: 'Professional Bodies',
      verifier: 'Employers',
      leftStep: 'Issue to Wallet',
      rightStep: 'Present / Verify',
    },
    {
      id: 3,
      title: 'Bank Loan Application Verification',
      issuer: 'University Degrees',
      verifier: 'Bank Loan Providers',
      leftStep: 'Issue to Wallet',
      rightStep: 'Present / Verify',
    },
  ];

  const Phone = () => (
    <div className="ucf-phone" aria-label="Smartphone with wallet">
      <div className="ucf-phone-status" />
      <div className="ucf-phone-screen">
        {/* simple QR layout */}
        <div className="qr q1" />
        <div className="qr q2" />
        <div className="qr q3" />
        <div className="qr q4" />
      </div>
      <div className="ucf-phone-home" />
      <div className="ucf-phone-caption">Wallet / QR</div>
    </div>
  );

  const Arrow = ({ label }) => (
    <div className="ucf-arrow">
      <svg className="ucf-arrow-line" viewBox="0 0 140 2" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <marker id="ucfArrowHead" markerWidth="8" markerHeight="8" refX="6" refY="2" orient="auto">
            <path d="M0,0 L8,2 L0,4 Z" fill="var(--ink-500)" />
          </marker>
        </defs>
        <line x1="0" y1="1" x2="138" y2="1" stroke="var(--ink-500)" strokeWidth="2" markerEnd="url(#ucfArrowHead)" />
      </svg>
      <div className="ucf-arrow-label">{label}</div>
    </div>
  );

  const Card = ({ label, tone }) => (
    <div className={`ucf-card ${tone}`} role="group" aria-label={label}>
      <div className="ucf-card-label">{label}</div>
      <div className="ucf-card-caption">{tone === 'issuer' ? 'Issuer' : 'Verifier'}</div>
    </div>
  );

  return (
    <main className="ucf-page" aria-labelledby="ucfTitle">
      <h1 id="ucfTitle" className="ucf-title">Verification Use Case Flows</h1>

      <section className="ucf-flows" aria-label="Three verification flows">
        {flows.map(flow => (
          <article key={flow.id} className="ucf-flow" aria-label={flow.title}>
            <header className="ucf-flow-title">
              <span className="ucf-flow-index">{flow.id})</span> {flow.title}
            </header>

            <div className="ucf-flow-grid">
              <Card label={flow.issuer} tone="issuer" />
              <Arrow label={flow.leftStep} />
              <Phone />
              <Arrow label={flow.rightStep} />
              <Card label={flow.verifier} tone="verifier" />
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
