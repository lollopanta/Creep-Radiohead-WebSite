import React from 'react';

interface StructureDiagramProps {
  className?: string;
}

const StructureDiagram: React.FC<StructureDiagramProps> = ({ className = '' }) => {
  return (
    <svg 
      width={800} 
      height={600} 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Title */}
      <text
        x={400}
        y={40}
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize={24}
        fontWeight="bold"
        fill="#333"
        className="dark:fill-gray-200"
      >
        Structure & Meter Analysis: "Creep" - Radiohead
      </text>
      <line x1={50} y1={80} x2={750} y2={80} stroke="#666" strokeWidth={2} className="dark:stroke-gray-600" />

      {/* INTRO */}
      <g>
        <rect
          x={50}
          y={100}
          width={120}
          height={80}
          fill="#F2A704"
          fillOpacity={0.2}
          stroke="#F2A704"
          strokeWidth={2}
          className="hover:fill-opacity-30 transition-opacity"
        />
        <text
          x={110}
          y={125}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={12}
          fontWeight="bold"
          fill="#F2A704"
          className="dark:fill-pablo-yellow"
        >
          INTRO
        </text>
        <text
          x={110}
          y={140}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={10}
          fill="#333"
          className="dark:fill-gray-300"
        >
          0:00 - 0:15
        </text>
        <text
          x={110}
          y={155}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={9}
          fill="#666"
          className="dark:fill-gray-400"
        >
          4/4 • 92 BPM
        </text>
        <text
          x={110}
          y={170}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={8}
          fill="#666"
          className="dark:fill-gray-400"
        >
          Sparse, clean guitar
        </text>
      </g>

      {/* VERSE 1 */}
      <g>
        <rect
          x={170}
          y={100}
          width={120}
          height={80}
          fill="#6484AC"
          fillOpacity={0.2}
          stroke="#6484AC"
          strokeWidth={2}
          className="hover:fill-opacity-30 transition-opacity"
        />
        <text
          x={230}
          y={125}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={12}
          fontWeight="bold"
          fill="#6484AC"
          className="dark:fill-pablo-blue"
        >
          VERSE 1
        </text>
        <text
          x={230}
          y={140}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={10}
          fill="#333"
          className="dark:fill-gray-300"
        >
          0:15 - 0:45
        </text>
        <text
          x={230}
          y={155}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={9}
          fill="#666"
          className="dark:fill-gray-400"
        >
          4/4 • Gentle build
        </text>
        <text
          x={230}
          y={170}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={8}
          fill="#666"
          className="dark:fill-gray-400"
        >
          8-10 syllables/line
        </text>
      </g>

      {/* CHORUS 1 */}
      <g>
        <rect
          x={290}
          y={100}
          width={120}
          height={80}
          fill="#C77017"
          fillOpacity={0.2}
          stroke="#C77017"
          strokeWidth={2}
          className="hover:fill-opacity-30 transition-opacity"
        />
        <text
          x={350}
          y={125}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={12}
          fontWeight="bold"
          fill="#C77017"
          className="dark:fill-pablo-orange"
        >
          CHORUS 1
        </text>
        <text
          x={350}
          y={140}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={10}
          fill="#333"
          className="dark:fill-gray-300"
        >
          0:45 - 1:10
        </text>
        <text
          x={350}
          y={155}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={9}
          fill="#666"
          className="dark:fill-gray-400"
        >
          4/4 • Explosive
        </text>
        <text
          x={350}
          y={170}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={8}
          fill="#666"
          className="dark:fill-gray-400"
        >
          Guitar crunches
        </text>
      </g>

      {/* VERSE 2 */}
      <g>
        <rect
          x={410}
          y={100}
          width={120}
          height={80}
          fill="#6484AC"
          fillOpacity={0.2}
          stroke="#6484AC"
          strokeWidth={2}
          className="hover:fill-opacity-30 transition-opacity"
        />
        <text
          x={470}
          y={125}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={12}
          fontWeight="bold"
          fill="#6484AC"
          className="dark:fill-pablo-blue"
        >
          VERSE 2
        </text>
        <text
          x={470}
          y={140}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={10}
          fill="#333"
          className="dark:fill-gray-300"
        >
          1:10 - 1:55
        </text>
        <text
          x={470}
          y={155}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={9}
          fill="#666"
          className="dark:fill-gray-400"
        >
          4/4 • Intensifying
        </text>
        <text
          x={470}
          y={170}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={8}
          fill="#666"
          className="dark:fill-gray-400"
        >
          Building tension
        </text>
      </g>

      {/* CHORUS 2 */}
      <g>
        <rect
          x={530}
          y={100}
          width={120}
          height={80}
          fill="#C77017"
          fillOpacity={0.2}
          stroke="#C77017"
          strokeWidth={2}
          className="hover:fill-opacity-30 transition-opacity"
        />
        <text
          x={590}
          y={125}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={12}
          fontWeight="bold"
          fill="#C77017"
          className="dark:fill-pablo-orange"
        >
          CHORUS 2
        </text>
        <text
          x={590}
          y={140}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={10}
          fill="#333"
          className="dark:fill-gray-300"
        >
          1:55 - 2:20
        </text>
        <text
          x={590}
          y={155}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={9}
          fill="#666"
          className="dark:fill-gray-400"
        >
          4/4 • Climactic
        </text>
        <text
          x={590}
          y={170}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={8}
          fill="#666"
          className="dark:fill-gray-400"
        >
          Full intensity
        </text>
      </g>

      {/* BRIDGE */}
      <g>
        <rect
          x={650}
          y={100}
          width={120}
          height={80}
          fill="#EAC986"
          fillOpacity={0.2}
          stroke="#EAC986"
          strokeWidth={2}
          className="hover:fill-opacity-30 transition-opacity"
        />
        <text
          x={710}
          y={125}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={12}
          fontWeight="bold"
          fill="#EAC986"
          className="dark:fill-pablo-cream"
        >
          BRIDGE
        </text>
        <text
          x={710}
          y={140}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={10}
          fill="#333"
          className="dark:fill-gray-300"
        >
          2:20 - 2:50
        </text>
        <text
          x={710}
          y={155}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={9}
          fill="#666"
          className="dark:fill-gray-400"
        >
          4/4 • Atmospheric
        </text>
        <text
          x={710}
          y={170}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={8}
          fill="#666"
          className="dark:fill-gray-400"
        >
          Dreamlike quality
        </text>
      </g>

      {/* FINAL CHORUS */}
      <g>
        <rect
          x={530}
          y={200}
          width={240}
          height={80}
          fill="#F2A704"
          fillOpacity={0.2}
          stroke="#F2A704"
          strokeWidth={2}
          className="hover:fill-opacity-30 transition-opacity"
        />
        <text
          x={650}
          y={225}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={12}
          fontWeight="bold"
          fill="#F2A704"
          className="dark:fill-pablo-yellow"
        >
          FINAL CHORUS
        </text>
        <text
          x={650}
          y={240}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={10}
          fill="#333"
          className="dark:fill-gray-300"
        >
          2:50 - 3:55
        </text>
        <text
          x={650}
          y={255}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={9}
          fill="#666"
          className="dark:fill-gray-400"
        >
          4/4 • Fading intensity
        </text>
        <text
          x={650}
          y={270}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={8}
          fill="#666"
          className="dark:fill-gray-400"
        >
          Extended outro
        </text>
      </g>

      {/* Meter Analysis Box */}
      <rect
        x={50}
        y={300}
        width={200}
        height={120}
        fill="#CFC2B6"
        fillOpacity={0.3}
        stroke="#666"
        strokeWidth={1}
        className="dark:fill-pablo-beige dark:fill-opacity-20 dark:stroke-gray-600"
      />
      <text
        x={150}
        y={320}
        textAnchor="middle"
        fontFamily="Arial"
        fontSize={14}
        fontWeight="bold"
        fill="#333"
        className="dark:fill-gray-200"
      >
        Meter Analysis
      </text>
      <g>
        <rect
          x={70}
          y={340}
          width={160}
          height={30}
          fill="#fff"
          stroke="#666"
          strokeWidth={1}
          className="dark:fill-gray-800 dark:stroke-gray-600"
        />
        <text x={80} y={360} fontFamily="Arial" fontSize={12} fill="#333" className="dark:fill-gray-200">
          Time Signature: 4/4 throughout
        </text>
      </g>
      <g>
        <rect
          x={70}
          y={380}
          width={160}
          height={30}
          fill="#fff"
          stroke="#666"
          strokeWidth={1}
          className="dark:fill-gray-800 dark:stroke-gray-600"
        />
        <text x={80} y={400} fontFamily="Arial" fontSize={12} fill="#333" className="dark:fill-gray-200">
          Tempo: 92 BPM (steady)
        </text>
      </g>

      {/* Chord Progression Pattern */}
      <rect
        x={300}
        y={300}
        width={450}
        height={120}
        fill="#CFC2B6"
        fillOpacity={0.3}
        stroke="#666"
        strokeWidth={1}
        className="dark:fill-pablo-beige dark:fill-opacity-20 dark:stroke-gray-600"
      />
      <text
        x={525}
        y={320}
        textAnchor="middle"
        fontFamily="Arial"
        fontSize={14}
        fontWeight="bold"
        fill="#333"
        className="dark:fill-gray-200"
      >
        Chord Progression Pattern
      </text>
      <g>
        <circle
          cx={350}
          cy={370}
          r={30}
          fill="#F2A704"
          stroke="#fff"
          strokeWidth={2}
          className="dark:stroke-gray-800"
        />
        <text
          x={350}
          y={375}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={14}
          fontWeight="bold"
          fill="white"
        >
          G
        </text>
        <circle
          cx={430}
          cy={370}
          r={30}
          fill="#6484AC"
          stroke="#fff"
          strokeWidth={2}
          className="dark:stroke-gray-800"
        />
        <text
          x={430}
          y={375}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={14}
          fontWeight="bold"
          fill="white"
        >
          B
        </text>
        <circle
          cx={510}
          cy={370}
          r={30}
          fill="#C77017"
          stroke="#fff"
          strokeWidth={2}
          className="dark:stroke-gray-800"
        />
        <text
          x={510}
          y={375}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={14}
          fontWeight="bold"
          fill="white"
        >
          C
        </text>
        <circle
          cx={590}
          cy={370}
          r={30}
          fill="#EAC986"
          stroke="#fff"
          strokeWidth={2}
          className="dark:stroke-gray-800"
        />
        <text
          x={590}
          y={375}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={14}
          fontWeight="bold"
          fill="#333"
        >
          Cm
        </text>
        {/* Arrows */}
        <polygon points="385,370 395,365 395,375" fill="#666" className="dark:fill-gray-400" />
        <line x1={385} y1={370} x2={405} y2={370} stroke="#666" strokeWidth={2} className="dark:stroke-gray-400" />
        <polygon points="465,370 475,365 475,375" fill="#666" className="dark:fill-gray-400" />
        <line x1={465} y1={370} x2={485} y2={370} stroke="#666" strokeWidth={2} className="dark:stroke-gray-400" />
        <polygon points="545,370 555,365 555,375" fill="#666" className="dark:fill-gray-400" />
        <line x1={545} y1={370} x2={565} y2={370} stroke="#666" strokeWidth={2} className="dark:stroke-gray-400" />
        <path
          d="M 625,370 Q 650,350 625,330"
          stroke="#666"
          strokeWidth={2}
          fill="none"
          className="dark:stroke-gray-400"
        />
        <polygon points="625,330 620,340 630,340" fill="#666" className="dark:fill-gray-400" />
        <text
          x={650}
          y={325}
          textAnchor="middle"
          fontFamily="Arial"
          fontSize={10}
          fill="#666"
          className="dark:fill-gray-400"
        >
          repeats
        </text>
      </g>

      {/* Structural Characteristics */}
      <rect
        x={50}
        y={450}
        width={700}
        height={120}
        fill="#6484AC"
        fillOpacity={0.1}
        stroke="#6484AC"
        strokeWidth={1}
        className="dark:stroke-pablo-blue"
      />
      <text
        x={400}
        y={470}
        textAnchor="middle"
        fontFamily="Arial"
        fontSize={14}
        fontWeight="bold"
        fill="#6484AC"
        className="dark:fill-pablo-blue"
      >
        Structural Characteristics
      </text>
      <text x={70} y={500} fontFamily="Arial" fontSize={11} fill="#333" className="dark:fill-gray-300">
        • Verse: Contemplative, sparse instrumentation, builds tension
      </text>
      <text x={70} y={520} fontFamily="Arial" fontSize={11} fill="#333" className="dark:fill-gray-300">
        • Chorus: Explosive release with distorted guitar crunches
      </text>
      <text x={70} y={540} fontFamily="Arial" fontSize={11} fill="#333" className="dark:fill-gray-300">
        • Bridge: Atmospheric, dreamlike quality with repeated phrases
      </text>
      <text x={400} y={500} fontFamily="Arial" fontSize={11} fill="#333" className="dark:fill-gray-300">
        • Consistent 4/4 meter throughout entire song
      </text>
      <text x={400} y={520} fontFamily="Arial" fontSize={11} fill="#333" className="dark:fill-gray-300">
        • G-B-C-Cm chord progression defines harmonic structure
      </text>
      <text x={400} y={540} fontFamily="Arial" fontSize={11} fill="#333" className="dark:fill-gray-300">
        • Dynamic contrast between quiet verses and loud choruses
      </text>
      <text
        x={750}
        y={590}
        textAnchor="end"
        fontFamily="Arial"
        fontSize={10}
        fontStyle="italic"
        fill="#666"
        className="dark:fill-gray-400"
      >
        Key: G Major
      </text>
    </svg>
  );
};

export default StructureDiagram;

