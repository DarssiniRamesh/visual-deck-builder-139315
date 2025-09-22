import React from "react";
import "./workflow.css";

/**
 * PUBLIC_INTERFACE
 * WorkflowDiagram
 * ----------------
 * This component renders a single-slide SVG-based workflow diagram for the CXC Digital Credentialing Ecosystem.
 * It follows the layout, color tokens, iconography, arrows, legend, and typography guidance extracted from:
 * - assets/cxc_workflow_slide_design_notes.md
 * - assets/cxc_logo_reference_design_notes.md
 *
 * Changes in this refactor:
 * - All connectors are straight lines (no curves/bends)
 * - All text is wrapped or resized to fit within its container; helper utilities ensure no overflow
 * - Labels and flows are explicit and balanced with pixel-aligned positioning
 * - Color tokens, icons, and CXC branding are preserved
 */
const WorkflowDiagram = () => {
  // Canvas constants (as per spec)
  const WIDTH = 1920;
  const HEIGHT = 1080;
  const headerH = 80;

  // Hub geometry (centered)
  const hub = {
    cx: 960,
    cy: 480,
    r: 160,
  };

  // Left stack (External Issuers)
  const left = {
    x: 96,
    labelCard: { x: 96, y: 132, w: 320, h: 44, title: "External Issuers" },
    boxW: 320,
    boxH: 52,
    gap: 16,
    startY: 192,
    items: [
      "CXC (CAPE / CSEC)",
      "Private School Certificates",
      "Ministries of Education",
      "University Degrees",
      "Professional Bodies",
      "Other (K12 / HE)",
      "Digital Identity",
    ],
  };

  // Right stack (Consumers / Partners)
  const right = {
    x: 1460,
    csme: { x: 1460, y: 168, w: 300, h: 44, label: "CSME Integration" },
    revenue: { x: 1460, y: 224, w: 300, h: 80, title: "Revenue Model" },
    boxW: 300,
    boxH: 52,
    gap: 16,
    startY: 320,
    items: [
      "University Admission Offices",
      "Employers",
      "Professional Licensing Boards",
      "International Education Boards",
      "[Additional]",
    ],
  };

  // Bottom use cases
  const bottom = {
    sectionLabel: { x: 96, y: 760, text: "Use Case Flow Examples" },
    columns: [
      {
        x: 96,
        y: 812,
        title: "University Admission Verification",
        issuer: "CXC (CAPE / CSEC)",
        verifier: "University Admission Offices",
        stepLabels: { left: "Issue to Wallet", right: "Present / Verify" },
      },
      {
        x: 672,
        y: 812,
        title: "Employment Document Verification",
        issuer: "Professional Bodies",
        verifier: "Employers",
        stepLabels: { left: "Issue to Wallet", right: "Present / Verify" },
      },
      {
        x: 1248,
        y: 812,
        title: "Professional Licensing Document Verification",
        issuer: "University Degrees",
        verifier: "Professional Licensing Boards",
        stepLabels: { left: "Issue to Wallet", right: "Present / Verify" },
      },
    ],
  };

  // Legend
  const legend = {
    x: 1460,
    y: 820,
    w: 364,
    h: 200,
  };

  // ------------------------
  // Helpers: Geometry & Text
  // ------------------------

  // Compute a point on the left edge of the hub given an index to distribute vertically
  const hubLeftAnchor = (index, total) => {
    const span = 220; // total vertical span across hub left side
    const offset = total > 1 ? (index / (total - 1)) * span - span / 2 : 0;
    return { x: hub.cx - hub.r + 4, y: hub.cy + offset };
  };

  // Compute a point on the right edge of the hub given an index to distribute vertically
  const hubRightAnchor = (index, total) => {
    const span = 220;
    const offset = total > 1 ? (index / (total - 1)) * span - span / 2 : 0;
    return { x: hub.cx + hub.r - 4, y: hub.cy + offset };
  };

  // Text wrapping utility: naive word-wrap by character count per line
  const charWidthCoef = 0.62; // approximate width factor per fontSize (Helvetica/Arial em)
  const wrapByChars = (text, maxChars) => {
    if (!text) return [""];
    const words = text.split(" ");
    const lines = [];
    let current = "";
    words.forEach((w) => {
      const test = current.length ? `${current} ${w}` : w;
      if (test.length <= maxChars) {
        current = test;
      } else {
        if (current.length) lines.push(current);
        // If single long word exceeds maxChars, hard-break
        if (w.length > maxChars) {
          let start = 0;
          while (start < w.length) {
            lines.push(w.substring(start, start + maxChars));
            start += maxChars;
          }
          current = "";
        } else {
          current = w;
        }
      }
    });
    if (current.length) lines.push(current);
    return lines;
  };

  // Decide font size and wrap to fit within given width/height
  const computeWrappedLines = ({
    text,
    boxW,
    boxH,
    fontSingle = 18,
    fontMulti = 16,
    paddingX = 16,
    minFont = 14,
    maxLines = 2,
  }) => {
    const innerW = Math.max(0, boxW - paddingX * 2);
    const attempt = (f) => {
      const maxChars = Math.max(6, Math.floor(innerW / (f * charWidthCoef)));
      const lines = wrapByChars(text, maxChars);
      return { lines, f };
    };

    // Try single-line fit with fontSingle; if overflow, try multi-line with fontMulti; then reduce down to minFont if needed
    let { lines, f } = attempt(fontSingle);
    if (lines.length > 1) {
      ({ lines, f } = attempt(fontMulti));
    }
    while (lines.length > maxLines && f > minFont) {
      f -= 1;
      ({ lines, f } = attempt(f));
    }

    // Ensure final lines count fits the box height
    const lineHeight = Math.round(f + Math.max(2, f * 0.2)); // small padding between lines
    const totalTextH = lines.length * lineHeight;
    if (totalTextH > boxH - 8 && lines.length > 1) {
      // If still too tall, reduce font slightly
      const shrink = Math.max(0, Math.ceil((totalTextH - (boxH - 8)) / lines.length));
      const f2 = Math.max(minFont, f - shrink);
      ({ lines, f } = attempt(f2));
    }

    return { lines, fontSize: f, lineHeight };
  };

  // Draw wrapped text inside a box area
  const WrappedBoxText = ({
    x,
    y,
    w,
    h,
    text,
    fill = "var(--white)",
    fontSingle = 18,
    fontMulti = 16,
    fontWeight = 700,
    paddingX = 16,
    anchor = "start", // or "middle"
  }) => {
    const { lines, fontSize, lineHeight } = computeWrappedLines({
      text,
      boxW: w,
      boxH: h,
      fontSingle,
      fontMulti,
      paddingX,
    });

    const textX = anchor === "middle" ? x + w / 2 : x + paddingX;
    // Vertically center the block of lines within the rectangle
    const textBlockH = lines.length * lineHeight;
    const yStart = y + (h - textBlockH) / 2;

    return (
      <text
        x={textX}
        y={yStart}
        fill={fill}
        fontSize={fontSize}
        fontWeight={fontWeight}
        dominantBaseline="hanging"
        textAnchor={anchor}
      >
        {lines.map((ln, i) => (
          <tspan key={i} x={textX} dy={i === 0 ? 0 : lineHeight}>
            {ln}
          </tspan>
        ))}
      </text>
    );
  };

  // Small phone illustration as a group
  const Phone = ({ x, y }) => {
    const w = 80;
    const h = 160;
    const r = 16;
    return (
      <g aria-label="Smartphone illustration">
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={r}
          ry={r}
          fill="var(--white)"
          stroke="var(--ink-300)"
          strokeWidth="2"
        />
        <rect x={x + 8} y={y + 28} width={w - 16} height={h - 56} rx="8" ry="8" fill="var(--ink-100)" />
        {/* Status bar */}
        <rect x={x + 8} y={y + 10} width={w - 16} height={12} rx="6" ry="6" fill="var(--cxc-blue)" />
        {/* QR icon simplified */}
        <g transform={`translate(${x + 20}, ${y + 56})`}>
          <rect width="14" height="14" fill="var(--ink-300)" />
          <rect x="4" y="4" width="6" height="6" fill="var(--ink-500)" />
          <rect x="20" y="0" width="14" height="14" fill="var(--ink-300)" />
          <rect x="24" y="4" width="6" height="6" fill="var(--ink-500)" />
          <rect x="0" y="20" width="14" height="14" fill="var(--ink-300)" />
          <rect x="4" y="24" width="6" height="6" fill="var(--ink-500)" />
          <rect x="20" y="20" width="14" height="14" fill="var(--ink-300)" />
          <rect x="24" y="24" width="6" height="6" fill="var(--ink-500)" />
        </g>
        {/* Home indicator */}
        <rect
          x={x + w / 2 - 14}
          y={y + h - 14}
          width="28"
          height="4"
          rx="2"
          ry="2"
          fill="var(--accent-orange)"
        />
      </g>
    );
  };

  // Micro card (green or purple) with wrapped text
  const MicroCard = ({
    x,
    y,
    w = 160,
    h = 44,
    label,
    fill,
    textFill = "var(--white)",
  }) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" ry="8" fill={fill} filter="url(#shadowSoft)" />
      <WrappedBoxText x={x} y={y} w={w} h={h} text={label} fill={textFill} fontSingle={16} fontMulti={14} />
    </g>
  );

  // General card (simple header + small subtitle)
  const Card = ({ x, y, w, h, title, subtitle, fill = "var(--white)", titleFill = "var(--cxc-navy)" }) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" ry="8" fill={fill} stroke="var(--ink-200)" />
      <text x={x + 16} y={y + 24} fontSize="18" fontWeight="700" fill={titleFill} dominantBaseline="middle">
        {title}
      </text>
      {subtitle ? (
        <text
          x={x + 16}
          y={y + 48}
          fontSize="14"
          fontWeight="500"
          fill="var(--ink-700)"
          dominantBaseline="middle"
        >
          {subtitle}
        </text>
      ) : null}
    </g>
  );

  // Star icon
  const Star = ({ cx, cy, r = 10, fill = "var(--accent-gold)", stroke = "var(--accent-orange)" }) => {
    // Simple 5-point star path
    const path =
      "M0,-1 L0.2245,-0.3090 L0.9511,-0.3090 L0.3633,0.1180 L0.5878,0.8090 L0,0.3819 L-0.5878,0.8090 L-0.3633,0.1180 L-0.9511,-0.3090 L-0.2245,-0.3090 Z";
    return (
      <g transform={`translate(${cx}, ${cy}) scale(${r * 10})`} aria-hidden="true">
        <path d={path} fill={fill} stroke={stroke} strokeWidth="0.04" />
      </g>
    );
  };

  // Header right callout line with star
  const HeaderCallout = ({ x, y, text }) => (
    <g>
      <Star cx={x + 10} cy={y - 6} r={1.2} />
      <text x={x + 28} y={y - 2} fontSize="16" fontWeight="600" fill="var(--white)" dominantBaseline="middle">
        {text}
      </text>
    </g>
  );

  return (
    <div
      className="workflow-container"
      role="img"
      aria-label="CXC Digital Credentialing Ecosystem workflow diagram"
    >
      <svg
        className="workflow-svg"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
        height="auto"
        role="presentation"
        aria-hidden="false"
      >
        <defs>
          {/* Soft shadow */}
          <filter id="shadowSoft" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.18" />
          </filter>

          {/* Arrowheads */}
          <marker
            id="arrowGreen"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L10,3 L0,6 Z" fill="var(--link-green)" />
          </marker>
          <marker
            id="arrowPurple"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L10,3 L0,6 Z" fill="var(--link-purple)" />
          </marker>
          <marker
            id="arrowNeutral"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L10,3 L0,6 Z" fill="var(--ink-500)" />
          </marker>
        </defs>

        {/* Header bar */}
        <rect x="0" y="0" width={WIDTH} height={headerH} fill="var(--cxc-navy)" />
        <text x="96" y="40" fontSize="48" fontWeight="700" fill="var(--white)" dominantBaseline="middle">
          Current Infrastructure Integration
        </text>

        {/* Header right callouts (anchored to right with ~96px padding) */}
        <g transform={`translate(${WIDTH - 520}, 26)`}>
          <HeaderCallout x={0} y={18} text="Can Leverage" />
          <HeaderCallout x={0} y={44} text="Mobile Wallet / QR Verification" />
          <HeaderCallout x={0} y={70} text="Blockchain Platform" />
          {/* White-label enhancements pill */}
          <g transform="translate(260, -6)">
            <rect
              x="0"
              y="0"
              width="240"
              height="44"
              rx="22"
              ry="22"
              fill="var(--cxc-navy-700)"
              stroke="var(--white)"
              opacity="0.95"
            />
            <text
              x="120"
              y="22"
              textAnchor="middle"
              fontSize="16"
              fontWeight="700"
              fill="var(--white)"
              dominantBaseline="middle"
            >
              White-label enhancements
            </text>
          </g>
        </g>

        {/* Central Hub */}
        <g filter="url(#shadowSoft)">
          <circle cx={hub.cx} cy={hub.cy} r={hub.r} fill="var(--cxc-navy)" />
          {/* Accent ring */}
          <circle
            cx={hub.cx}
            cy={hub.cy}
            r={hub.r - 6}
            fill="none"
            stroke="var(--cxc-blue)"
            strokeWidth="2"
            opacity="0.6"
          />
        </g>
        <text
          x={hub.cx}
          y={hub.cy - 12}
          textAnchor="middle"
          fontSize="48"
          fontWeight="800"
          fill="var(--white)"
          letterSpacing="0.5"
          dominantBaseline="middle"
        >
          CXC
        </text>
        <text
          x={hub.cx}
          y={hub.cy + 20}
          textAnchor="middle"
          fontSize="22"
          fontWeight="700"
          fill="var(--white)"
          dominantBaseline="middle"
        >
          Network Operator
        </text>
        <text
          x={hub.cx}
          y={hub.cy + 44}
          textAnchor="middle"
          fontSize="14"
          fontWeight="500"
          fill="rgba(255,255,255,.75)"
          dominantBaseline="middle"
        >
          Powered by [Platform]
        </text>

        {/* Left label card */}
        <Card
          x={left.labelCard.x}
          y={left.labelCard.y}
          w={left.labelCard.w}
          h={left.labelCard.h}
          title={left.labelCard.title}
        />

        {/* Left stack boxes + straight connectors */}
        {left.items.map((label, i) => {
          const x = left.x;
          const y = left.startY + i * (left.boxH + left.gap);
          const midRight = { x: x + left.boxW, y: y + left.boxH / 2 };
          const end = hubLeftAnchor(i, left.items.length);
          return (
            <g key={`left-${i}`}>
              <rect
                x={x}
                y={y}
                width={left.boxW}
                height={left.boxH}
                rx="8"
                ry="8"
                fill="var(--green-500)"
                filter="url(#shadowSoft)"
              />
              <WrappedBoxText x={x} y={y} w={left.boxW} h={left.boxH} text={label} fill="var(--white)" />
              {/* Straight connector */}
              <line
                x1={midRight.x}
                y1={midRight.y}
                x2={end.x}
                y2={end.y}
                stroke="var(--link-green)"
                strokeWidth="2"
                markerEnd="url(#arrowGreen)"
              />
            </g>
          );
        })}

        {/* Right specials: CSME pill */}
        <g>
          <rect
            x={right.csme.x}
            y={right.csme.y}
            width={right.csme.w}
            height={right.csme.h}
            rx="22"
            ry="22"
            fill="var(--accent-red)"
            filter="url(#shadowSoft)"
          />
          <text
            x={right.csme.x + right.csme.w / 2}
            y={right.csme.y + right.csme.h / 2}
            textAnchor="middle"
            fontSize="18"
            fontWeight="700"
            fill="var(--white)"
            dominantBaseline="middle"
          >
            {right.csme.label}
          </text>
        </g>

        {/* Right Revenue Model card */}
        <g>
          <rect
            x={right.revenue.x}
            y={right.revenue.y}
            width={right.revenue.w}
            height={right.revenue.h}
            rx="8"
            ry="8"
            fill="var(--ink-100)"
            stroke="var(--ink-200)"
          />
          <text
            x={right.revenue.x + 16}
            y={right.revenue.y + 26}
            fontSize="18"
            fontWeight="700"
            fill="var(--cxc-navy)"
            dominantBaseline="middle"
          >
            {right.revenue.title}
          </text>
          <text
            x={right.revenue.x + 16}
            y={right.revenue.y + 50}
            fontSize="14"
            fontWeight="500"
            fill="var(--ink-700)"
            dominantBaseline="middle"
          >
            • Placeholder line 1
          </text>
          <text
            x={right.revenue.x + 16}
            y={right.revenue.y + 68}
            fontSize="14"
            fontWeight="500"
            fill="var(--ink-700)"
            dominantBaseline="middle"
          >
            • Placeholder line 2
          </text>
        </g>

        {/* Right stack boxes + straight connectors */}
        {right.items.map((label, i) => {
          const x = right.x;
          const y = right.startY + i * (right.boxH + right.gap);
          const midLeft = { x: x, y: y + right.boxH / 2 };
          const start = hubRightAnchor(i, right.items.length);
          return (
            <g key={`right-${i}`}>
              <rect
                x={x}
                y={y}
                width={right.boxW}
                height={right.boxH}
                rx="8"
                ry="8"
                fill="var(--purple-600)"
                filter="url(#shadowSoft)"
              />
              <WrappedBoxText x={x} y={y} w={right.boxW} h={right.boxH} text={label} fill="var(--white)" />
              {/* Straight connector */}
              <line
                x1={start.x}
                y1={start.y}
                x2={midLeft.x}
                y2={midLeft.y}
                stroke="var(--link-purple)"
                strokeWidth="2"
                markerEnd="url(#arrowPurple)"
              />
            </g>
          );
        })}

        {/* Bottom Use Case Section Label */}
        <text
          x={bottom.sectionLabel.x}
          y={bottom.sectionLabel.y}
          fontSize="32"
          fontWeight="700"
          fill="var(--cxc-navy)"
          dominantBaseline="middle"
        >
          {bottom.sectionLabel.text}
        </text>

        {/* Bottom Use Case Flows (3 columns) */}
        {bottom.columns.map((col, idx) => {
          const issuerX = col.x;
          const issuerY = col.y + 20;
          const phoneX = issuerX + 170; // slight spacing for straight arrow
          const phoneY = issuerY - 58;
          const verifierX = phoneX + 190;
          const verifierY = issuerY;

          return (
            <g key={`flow-${idx}`}>
              {/* Title */}
              <text x={col.x} y={col.y} fontSize="18" fontWeight="700" fill="var(--ink-900)" dominantBaseline="middle">
                {idx + 1}) {col.title}
              </text>

              {/* Issuer micro-card */}
              <MicroCard x={issuerX} y={issuerY} label={col.issuer} fill="var(--green-400)" />

              {/* Arrow -> Phone (straight) */}
              <line
                x1={issuerX + 160}
                y1={issuerY + 22}
                x2={phoneX - 14}
                y2={issuerY + 22}
                stroke="var(--ink-500)"
                strokeWidth="2"
                markerEnd="url(#arrowNeutral)"
              />
              <text
                x={(issuerX + 160 + (phoneX - 14)) / 2}
                y={issuerY + 10}
                fontSize="12"
                fontWeight="600"
                fill="var(--ink-700)"
                textAnchor="middle"
                dominantBaseline="ideographic"
              >
                {col.stepLabels.left}
              </text>

              {/* Phone */}
              <Phone x={phoneX} y={phoneY} />
              <text
                x={phoneX + 40}
                y={phoneY + 180}
                textAnchor="middle"
                fontSize="14"
                fontWeight="500"
                fill="var(--ink-700)"
                dominantBaseline="middle"
              >
                Wallet / QR
              </text>

              {/* Arrow -> Verifier (straight) */}
              <line
                x1={phoneX + 94}
                y1={issuerY + 22}
                x2={verifierX - 10}
                y2={issuerY + 22}
                stroke="var(--ink-500)"
                strokeWidth="2"
                markerEnd="url(#arrowNeutral)"
              />
              <text
                x={(phoneX + 94 + (verifierX - 10)) / 2}
                y={issuerY + 10}
                fontSize="12"
                fontWeight="600"
                fill="var(--ink-700)"
                textAnchor="middle"
                dominantBaseline="ideographic"
              >
                {col.stepLabels.right}
              </text>

              {/* Verifier micro-card */}
              <MicroCard x={verifierX} y={verifierY} label={col.verifier} fill="var(--purple-500)" />

              {/* Captions under issuer and verifier */}
              <text
                x={issuerX + 80}
                y={issuerY + 68}
                textAnchor="middle"
                fontSize="14"
                fontWeight="500"
                fill="var(--ink-700)"
                dominantBaseline="middle"
              >
                Issuer
              </text>
              <text
                x={verifierX + 80}
                y={verifierY + 68}
                textAnchor="middle"
                fontSize="14"
                fontWeight="500"
                fill="var(--ink-700)"
                dominantBaseline="middle"
              >
                Verifier
              </text>
            </g>
          );
        })}

        {/* Legend (bottom-right) */}
        <g transform={`translate(${legend.x}, ${legend.y})`}>
          <rect width={legend.w} height={legend.h} rx="8" ry="8" fill="var(--white)" stroke="var(--ink-200)" />
          <text x="16" y="22" fontSize="16" fontWeight="800" fill="var(--cxc-navy)" dominantBaseline="middle">
            LEGEND
          </text>

          {/* Lines legend */}
          <g transform="translate(16, 48)">
            <line x1="0" y1="0" x2="36" y2="0" stroke="var(--link-green)" strokeWidth="3" />
            <text x="48" y="4" fontSize="14" fontWeight="500" fill="var(--ink-700)" dominantBaseline="middle">
              Green connectors = Issuer → Hub
            </text>
          </g>
          <g transform="translate(16, 74)">
            <line x1="0" y1="0" x2="36" y2="0" stroke="var(--link-purple)" strokeWidth="3" />
            <text x="48" y="4" fontSize="14" fontWeight="500" fill="var(--ink-700)" dominantBaseline="middle">
              Purple connectors = Hub → Consumer
            </text>
          </g>
          <g transform="translate(16, 100)">
            <line
              x1="0"
              y1="0"
              x2="36"
              y2="0"
              stroke="var(--link-gray)"
              strokeWidth="3"
              strokeDasharray="6 6"
            />
            <text x="48" y="4" fontSize="14" fontWeight="500" fill="var(--ink-700)" dominantBaseline="middle">
              Dashed gray = Optional/Planned integration
            </text>
          </g>

          {/* Icon keys */}
          <g transform="translate(16, 128)">
            <Star cx={8} cy={-2} r={1.2} />
            <text x="24" y="2" fontSize="14" fontWeight="500" fill="var(--ink-700)" dominantBaseline="middle">
              Star = Leverage/Benefit
            </text>
          </g>
          <g transform="translate(16, 152)">
            {/* Mini phone glyph */}
            <rect x="0" y="-10" width="16" height="24" rx="3" ry="3" fill="var(--ink-300)" />
            <text x="24" y="2" fontSize="14" fontWeight="500" fill="var(--ink-700)" dominantBaseline="middle">
              Phone = Mobile Wallet
            </text>
          </g>
          <g transform="translate(16, 176)">
            {/* Mini QR glyph */}
            <rect x="0" y="-10" width="16" height="16" fill="var(--ink-300)" />
            <rect x="3" y="-7" width="10" height="10" fill="var(--ink-500)" />
            <text x="24" y="0" fontSize="14" fontWeight="500" fill="var(--ink-700)" dominantBaseline="middle">
              QR = Verification
            </text>
          </g>

          <text
            x={legend.w - 16}
            y={legend.h - 14}
            textAnchor="end"
            fontSize="12"
            fontWeight="500"
            fill="var(--ink-500)"
            dominantBaseline="middle"
          >
            CXC Concept Visualization
          </text>
        </g>
      </svg>
    </div>
  );
};

export default WorkflowDiagram;
