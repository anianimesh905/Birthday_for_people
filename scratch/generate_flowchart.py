import os

def generate_drawio():
    xml = """<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="Electron" modified="2026-07-06T18:00:00.000Z" agent="Mozilla/5.0" version="21.6.8" type="device">
  <diagram id="auth_initialization_flow" name="Page-1">
    <mxGraphModel dx="1200" dy="1200" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        
        <!-- Start Node -->
        <mxCell id="start" value="START&lt;br&gt;Visitor Opens Page" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FFF8E1;strokeColor=#D4AF37;strokeWidth=2;fontFamily=Cinzel;fontColor=#3E2714;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="375" y="40" width="100" height="60" as="geometry" />
        </mxCell>
        
        <!-- Preloader Process -->
        <mxCell id="preload" value="Parallel Preloader&lt;br&gt;(Download assets, track sizes &amp;amp; stream progress)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFF8E1;strokeColor=#D4AF37;strokeWidth=2;fontFamily=Lora;fontColor=#3E2714;" vertex="1" parent="1">
          <mxGeometry x="310" y="140" width="230" height="60" as="geometry" />
        </mxCell>
        
        <!-- Decision 1: Timeout / Preload Success -->
        <mxCell id="dec1" value="Preload Complete&lt;br&gt;in &amp;lt; 15s?" style="rhombus;whiteSpace=wrap;html=1;fillColor=#FFF8E1;strokeColor=#D4AF37;strokeWidth=2;fontFamily=Lora;fontColor=#3E2714;" vertex="1" parent="1">
          <mxGeometry x="335" y="240" width="180" height="100" as="geometry" />
        </mxCell>
        
        <!-- Yes Path: Process Audio & Initialize -->
        <mxCell id="audio_init" value="Play Procedural Sounds&lt;br&gt;(Wax seal crack noise + scroll parchment rustle)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#E8F5E9;strokeColor=#2E7D32;strokeWidth=2;fontFamily=Lora;fontColor=#1B5E20;" vertex="1" parent="1">
          <mxGeometry x="190" y="380" width="200" height="60" as="geometry" />
        </mxCell>
        
        <!-- No Path: Fallback On-Demand -->
        <mxCell id="fallback" value="Fallback Recovery&lt;br&gt;(Abort stream, hide loader, load assets on-demand)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFEBEE;strokeColor=#C62828;strokeWidth=2;fontFamily=Lora;fontColor=#B71C1C;" vertex="1" parent="1">
          <mxGeometry x="460" y="380" width="200" height="60" as="geometry" />
        </mxCell>
        
        <!-- Envelope Screen -->
        <mxCell id="envelope_screen" value="Show Envelope Scene&lt;br&gt;(Render Hogwarts letter &amp;amp; house wax seal)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFF8E1;strokeColor=#D4AF37;strokeWidth=2;fontFamily=Lora;fontColor=#3E2714;" vertex="1" parent="1">
          <mxGeometry x="325" y="490" width="200" height="60" as="geometry" />
        </mxCell>
        
        <!-- Biometric Check -->
        <mxCell id="bio_check" value="Biometric Sensor Check&lt;br&gt;(Query WebAuthn API availability for TouchID/FaceID)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#E1F5FE;strokeColor=#0277BD;strokeWidth=2;fontFamily=Lora;fontColor=#01579B;" vertex="1" parent="1">
          <mxGeometry x="315" y="590" width="220" height="60" as="geometry" />
        </mxCell>
        
        <!-- Decision 2: Verify -->
        <mxCell id="dec2" value="Biometrics Available&lt;br&gt;&amp;amp; Verified?" style="rhombus;whiteSpace=wrap;html=1;fillColor=#E1F5FE;strokeColor=#0277BD;strokeWidth=2;fontFamily=Lora;fontColor=#01579B;" vertex="1" parent="1">
          <mxGeometry x="330" y="690" width="190" height="100" as="geometry" />
        </mxCell>
        
        <!-- Yes Path: Unseal -->
        <mxCell id="unseal" value="Auto-Unseal &amp;amp; Unlock&lt;br&gt;(Crack seal, fly open chest, auto-decrypt message)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#E8F5E9;strokeColor=#2E7D32;strokeWidth=2;fontFamily=Lora;fontColor=#1B5E20;" vertex="1" parent="1">
          <mxGeometry x="190" y="830" width="200" height="60" as="geometry" />
        </mxCell>
        
        <!-- No Path: Manual Crest Sorting -->
        <mxCell id="manual" value="Manual Crest Sorting&lt;br&gt;(Revert to Sorting Hat badge selection, manual click)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFEBEE;strokeColor=#C62828;strokeWidth=2;fontFamily=Lora;fontColor=#B71C1C;" vertex="1" parent="1">
          <mxGeometry x="460" y="830" width="200" height="60" as="geometry" />
        </mxCell>
        
        <!-- Open Scroll -->
        <mxCell id="open_scroll" value="Reveal Hogwarts Scroll&lt;br&gt;(Play unroll animation, typewriter text stagger)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFF8E1;strokeColor=#D4AF37;strokeWidth=2;fontFamily=Lora;fontColor=#3E2714;" vertex="1" parent="1">
          <mxGeometry x="325" y="940" width="200" height="60" as="geometry" />
        </mxCell>
        
        <!-- End Node -->
        <mxCell id="end" value="END&lt;br&gt;Birthday Message View" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FFF8E1;strokeColor=#D4AF37;strokeWidth=2;fontFamily=Cinzel;fontColor=#3E2714;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="375" y="1040" width="100" height="60" as="geometry" />
        </mxCell>
        
        <!-- Edges -->
        <mxCell id="e1" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#D4AF37;strokeWidth=1.5;" edge="1" parent="1" source="start" target="preload" />
        <mxCell id="e2" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#D4AF37;strokeWidth=1.5;" edge="1" parent="1" source="preload" target="dec1" />
        
        <mxCell id="e3" value="YES" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#2E7D32;strokeWidth=1.5;fontColor=#1B5E20;fontStyle=1" edge="1" parent="1" source="dec1" target="audio_init">
          <mxGeometry relative="1" as="geometry">
            <Array points="290, 290; 290, 380" />
          </mxGeometry>
        </mxCell>
        
        <mxCell id="e4" value="NO" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#C62828;strokeWidth=1.5;fontColor=#B71C1C;fontStyle=1" edge="1" parent="1" source="dec1" target="fallback">
          <mxGeometry relative="1" as="geometry">
            <Array points="560, 290; 560, 380" />
          </mxGeometry>
        </mxCell>
        
        <mxCell id="e5" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#2E7D32;strokeWidth=1.5;" edge="1" parent="1" source="audio_init" target="envelope_screen">
          <mxGeometry relative="1" as="geometry">
            <Array points="290, 465; 425, 465" />
          </mxGeometry>
        </mxCell>
        
        <mxCell id="e6" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#C62828;strokeWidth=1.5;" edge="1" parent="1" source="fallback" target="envelope_screen">
          <mxGeometry relative="1" as="geometry">
            <Array points="560, 465; 425, 465" />
          </mxGeometry>
        </mxCell>
        
        <mxCell id="e7" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#D4AF37;strokeWidth=1.5;" edge="1" parent="1" source="envelope_screen" target="bio_check" />
        <mxCell id="e8" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#0277BD;strokeWidth=1.5;" edge="1" parent="1" source="bio_check" target="dec2" />
        
        <mxCell id="e9" value="YES" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#2E7D32;strokeWidth=1.5;fontColor=#1B5E20;fontStyle=1" edge="1" parent="1" source="dec2" target="unseal">
          <mxGeometry relative="1" as="geometry">
            <Array points="290, 740; 290, 830" />
          </mxGeometry>
        </mxCell>
        
        <mxCell id="e10" value="NO" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#C62828;strokeWidth=1.5;fontColor=#B71C1C;fontStyle=1" edge="1" parent="1" source="dec2" target="manual">
          <mxGeometry relative="1" as="geometry">
            <Array points="560, 740; 560, 830" />
          </mxGeometry>
        </mxCell>
        
        <mxCell id="e11" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#2E7D32;strokeWidth=1.5;" edge="1" parent="1" source="unseal" target="open_scroll">
          <mxGeometry relative="1" as="geometry">
            <Array points="290, 915; 425, 915" />
          </mxGeometry>
        </mxCell>
        
        <mxCell id="e12" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#C62828;strokeWidth=1.5;" edge="1" parent="1" source="manual" target="open_scroll">
          <mxGeometry relative="1" as="geometry">
            <Array points="560, 915; 425, 915" />
          </mxGeometry>
        </mxCell>
        
        <mxCell id="e13" style="edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=#D4AF37;strokeWidth=1.5;" edge="1" parent="1" source="open_scroll" target="end" />
        
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>"""
    with open('auth_flow.drawio', 'w', encoding='utf-8') as f:
        f.write(xml)
    print("Generated auth_flow.drawio successfully.")

def generate_svg():
    svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="100%" height="100%" style="background-color: #1A1510; font-family: 'Lora', serif;">
  <defs>
    <!-- Glow effect -->
    <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="green-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="blue-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="red-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    
    <!-- Arrowhead definition -->
    <marker id="arrow-gold" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#D4AF37" />
    </marker>
    <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#2E7D32" />
    </marker>
    <marker id="arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#C62828" />
    </marker>
    <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#0277BD" />
    </marker>
  </defs>

  <!-- Title Card -->
  <text x="400" y="35" text-anchor="middle" fill="#D4AF37" font-size="20" font-weight="bold" font-family="'Cinzel', serif" letter-spacing="2" filter="url(#gold-glow)">HOGWARTS BIRTHDAY SCRAPBOOK</text>
  <text x="400" y="55" text-anchor="middle" fill="#E4F0E7" font-size="12" font-style="italic" letter-spacing="1">Core Authentication &amp; Initialization Flow (incl. WebAuthn Biometrics)</text>

  <!-- START -->
  <g transform="translate(400, 110)">
    <ellipse cx="0" cy="0" rx="60" ry="25" fill="#2D2214" stroke="#D4AF37" stroke-width="2" filter="url(#gold-glow)" />
    <text x="0" y="4" text-anchor="middle" fill="#FFF8E1" font-size="12" font-weight="bold" font-family="'Cinzel', serif">START</text>
  </g>
  
  <line x1="400" y1="135" x2="400" y2="180" stroke="#D4AF37" stroke-width="2" marker-end="url(#arrow-gold)" />

  <!-- PRELOADER -->
  <g transform="translate(260, 180)">
    <rect x="0" y="0" width="280" height="60" rx="10" fill="#2D2214" stroke="#D4AF37" stroke-width="2" />
    <text x="140" y="26" text-anchor="middle" fill="#FFF8E1" font-size="13" font-weight="bold">Parallel Preloader System</text>
    <text x="140" y="44" text-anchor="middle" fill="#C5B29B" font-size="11">Stream video/audio cache concurrently</text>
  </g>

  <line x1="400" y1="240" x2="400" y2="285" stroke="#D4AF37" stroke-width="2" marker-end="url(#arrow-gold)" />

  <!-- DECISION 1 -->
  <g transform="translate(400, 335)">
    <!-- Rhombus points: (0, -50), (100, 0), (0, 50), (-100, 0) -->
    <polygon points="0,-45 90,0 0,45 -90,0" fill="#2D2214" stroke="#D4AF37" stroke-width="2" />
    <text x="0" y="-5" text-anchor="middle" fill="#FFF8E1" font-size="12" font-weight="bold">Preload Done</text>
    <text x="0" y="12" text-anchor="middle" fill="#FFF8E1" font-size="12" font-weight="bold">in &lt; 15s?</text>
  </g>

  <!-- Connectors from Decision 1 -->
  <!-- YES (Left) -->
  <path d="M 310 335 L 220 335 L 220 420" fill="none" stroke="#2E7D32" stroke-width="2" marker-end="url(#arrow-green)" />
  <text x="250" y="325" text-anchor="middle" fill="#4CAF50" font-size="12" font-weight="bold">YES</text>

  <!-- NO (Right) -->
  <path d="M 490 335 L 580 335 L 580 420" fill="none" stroke="#C62828" stroke-width="2" marker-end="url(#arrow-red)" />
  <text x="550" y="325" text-anchor="middle" fill="#EF4444" font-size="12" font-weight="bold">NO</text>

  <!-- YES PATH: Audio Init -->
  <g transform="translate(110, 420)">
    <rect x="0" y="0" width="220" height="60" rx="8" fill="#1C3322" stroke="#2E7D32" stroke-width="2" filter="url(#green-glow)" />
    <text x="110" y="26" text-anchor="middle" fill="#E8F5E9" font-size="12" font-weight="bold">Play Procedural Audio</text>
    <text x="110" y="44" text-anchor="middle" fill="#A5D6A7" font-size="10.5">Synthesize wax crack &amp; paper rustle</text>
  </g>

  <!-- NO PATH: Fallback -->
  <g transform="translate(470, 420)">
    <rect x="0" y="0" width="220" height="60" rx="8" fill="#3D1D20" stroke="#C62828" stroke-width="2" filter="url(#red-glow)" />
    <text x="110" y="26" text-anchor="middle" fill="#FFEBEE" font-size="12" font-weight="bold">Fallback Recovery</text>
    <text x="110" y="44" text-anchor="middle" fill="#EF9A9A" font-size="10.5">Abort stream, load on-demand</text>
  </g>

  <!-- Paths merging into Envelope Screen -->
  <path d="M 220 480 L 220 525 L 260 525" fill="none" stroke="#2E7D32" stroke-width="2" />
  <path d="M 580 480 L 580 525 L 540 525" fill="none" stroke="#C62828" stroke-width="2" />
  <line x1="400" y1="525" x2="400" y2="535" stroke="#D4AF37" stroke-width="2" />

  <!-- ENVELOPE SCREEN -->
  <g transform="translate(260, 535)">
    <rect x="0" y="0" width="280" height="60" rx="8" fill="#2D2214" stroke="#D4AF37" stroke-width="2" />
    <text x="140" y="26" text-anchor="middle" fill="#FFF8E1" font-size="13" font-weight="bold">Show Envelope Scene</text>
    <text x="140" y="44" text-anchor="middle" fill="#C5B29B" font-size="11">Display sealed letter &amp; delivery owl</text>
  </g>

  <line x1="400" y1="595" x2="400" y2="640" stroke="#D4AF37" stroke-width="2" marker-end="url(#arrow-gold)" />

  <!-- BIOMETRIC SENSOR CHECK -->
  <g transform="translate(250, 640)">
    <rect x="0" y="0" width="300" height="60" rx="8" fill="#142A3D" stroke="#0277BD" stroke-width="2" filter="url(#blue-glow)" />
    <text x="150" y="26" text-anchor="middle" fill="#E1F5FE" font-size="13" font-weight="bold">WebAuthn Biometric Check</text>
    <text x="150" y="44" text-anchor="middle" fill="#81D4FA" font-size="11">Detect Face ID / Touch ID hardware support</text>
  </g>

  <line x1="400" y1="700" x2="400" y2="745" stroke="#0277BD" stroke-width="2" marker-end="url(#arrow-blue)" />

  <!-- DECISION 2 -->
  <g transform="translate(400, 795)">
    <polygon points="0,-45 90,0 0,45 -90,0" fill="#2D2214" stroke="#0277BD" stroke-width="2" />
    <text x="0" y="-5" text-anchor="middle" fill="#FFF8E1" font-size="12" font-weight="bold">Biometrics OK</text>
    <text x="0" y="12" text-anchor="middle" fill="#FFF8E1" font-size="12" font-weight="bold">&amp; Authenticated?</text>
  </g>

  <!-- Connectors from Decision 2 -->
  <!-- YES (Left) -->
  <path d="M 310 795 L 220 795 L 220 880" fill="none" stroke="#2E7D32" stroke-width="2" marker-end="url(#arrow-green)" />
  <text x="250" y="785" text-anchor="middle" fill="#4CAF50" font-size="12" font-weight="bold">YES</text>

  <!-- NO (Right) -->
  <path d="M 490 795 L 580 795 L 580 880" fill="none" stroke="#C62828" stroke-width="2" marker-end="url(#arrow-red)" />
  <text x="550" y="785" text-anchor="middle" fill="#EF4444" font-size="12" font-weight="bold">NO</text>

  <!-- YES PATH: Auto-Unseal -->
  <g transform="translate(110, 880)">
    <rect x="0" y="0" width="220" height="60" rx="8" fill="#1C3322" stroke="#2E7D32" stroke-width="2" filter="url(#green-glow)" />
    <text x="110" y="26" text-anchor="middle" fill="#E8F5E9" font-size="12" font-weight="bold">Auto-Unseal Envelope</text>
    <text x="110" y="44" text-anchor="middle" fill="#A5D6A7" font-size="10.5">Decrypt message, crack wax seal</text>
  </g>

  <!-- NO PATH: Sorting Hat Fallback -->
  <g transform="translate(470, 880)">
    <rect x="0" y="0" width="220" height="60" rx="8" fill="#3D1D20" stroke="#C62828" stroke-width="2" filter="url(#red-glow)" />
    <text x="110" y="26" text-anchor="middle" fill="#FFEBEE" font-size="12" font-weight="bold">Manual Crest Sorting</text>
    <text x="110" y="44" text-anchor="middle" fill="#EF9A9A" font-size="10.5">Select house badges, manual tap</text>
  </g>

  <!-- Paths merging into Open Scroll -->
  <path d="M 220 940 L 220 985 L 260 985" fill="none" stroke="#2E7D32" stroke-width="2" />
  <path d="M 580 940 L 580 985 L 540 985" fill="none" stroke="#C62828" stroke-width="2" />
  <line x1="400" y1="985" x2="400" y2="995" stroke="#D4AF37" stroke-width="2" />

  <!-- REVEAL HOGWARTS SCROLL -->
  <g transform="translate(260, 995)">
    <rect x="0" y="0" width="280" height="60" rx="8" fill="#2D2214" stroke="#D4AF37" stroke-width="2" />
    <text x="140" y="26" text-anchor="middle" fill="#FFF8E1" font-size="13" font-weight="bold">Reveal Hogwarts Scroll</text>
    <text x="140" y="44" text-anchor="middle" fill="#C5B29B" font-size="11">Play unroll &amp; typewriter staggers</text>
  </g>

  <line x1="400" y1="1055" x2="400" y2="1100" stroke="#D4AF37" stroke-width="2" marker-end="url(#arrow-gold)" />

  <!-- END -->
  <g transform="translate(400, 1125)">
    <ellipse cx="0" cy="0" rx="60" ry="25" fill="#2D2214" stroke="#D4AF37" stroke-width="2" filter="url(#gold-glow)" />
    <text x="0" y="4" text-anchor="middle" fill="#FFF8E1" font-size="12" font-weight="bold" font-family="'Cinzel', serif">END</text>
  </g>

  <!-- Legend -->
  <g transform="translate(20, 1160)" font-size="10" fill="#C5B29B">
    <rect x="0" y="0" width="12" height="12" rx="2" fill="#2D2214" stroke="#D4AF37" stroke-width="1" />
    <text x="18" y="10">Core Flow</text>
    
    <rect x="110" y="0" width="12" height="12" rx="2" fill="#1C3322" stroke="#2E7D32" stroke-width="1" />
    <text x="128" y="10">Success Path</text>
    
    <rect x="230" y="0" width="12" height="12" rx="2" fill="#3D1D20" stroke="#C62828" stroke-width="1" />
    <text x="248" y="10">Fallback Path</text>
    
    <rect x="350" y="0" width="12" height="12" rx="2" fill="#142A3D" stroke="#0277BD" stroke-width="1" />
    <text x="368" y="10">Biometrics (WebAuthn)</text>
  </g>
</svg>"""
    with open('auth_flow.svg', 'w', encoding='utf-8') as f:
        f.write(svg)
    print("Generated auth_flow.svg successfully.")

if __name__ == '__main__':
    generate_drawio()
    generate_svg()
