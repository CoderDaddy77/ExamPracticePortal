import type { Subject, StudyMaterial, Chapter } from '../types';

const electricChargesStudyMaterial: StudyMaterial = {
  sections: [
    {
      id: 'charge-basics',
      title: 'Electric Charge',
      content: 'Charge is a fundamental property of matter. SI unit = Coulomb (C). Like charges repel, unlike attract. Charge is quantized (exists in multiples of e).'
    },
    {
      id: 'electric-field',
      title: 'Electric Field',
      content: 'Region around a charge where another charge feels force. Defined as E = F/q. Unit: N/C. Direction: from + to −.'
    },
    {
      id: 'coulombs-law',
      title: "Coulomb's Law",
      content: 'Force between two point charges varies as: F ∝ q₁q₂ / r². Inverse-square law. Valid only in electrostatic conditions.'
    },
    {
      id: 'coulomb-constant',
      title: 'Coulomb Constant k',
      content: 'k = 9 × 10⁹ N·m²/C². Used in F = k q₁q₂ / r².'
    },
    {
      id: 'field-lines',
      title: 'Electric Lines of Force',
      content: 'Imaginary lines showing field direction. Start from positive, end on negative. Never intersect.'
    },
    {
      id: 'electric-flux',
      title: 'Electric Flux',
      content: 'Flow of electric field through a surface. Flux Φ = E·A cosθ. Unit = N·m²/C.'
    },
    {
      id: 'gauss-law',
      title: "Gauss's Law",
      content: 'Total flux through a closed surface = charge enclosed / ε₀. Ignores surface shape—ONLY depends on net charge.'
    },
    {
      id: 'permittivity',
      title: 'Permittivity and Dielectric Constant',
      content: 'ε₀ is a measure of how much electric field passes through free space. K = ε / ε₀. Force in medium becomes F = Fvac / εᵣ.'
    },
    {
      id: 'electric-dipole',
      title: 'Electric Dipole',
      content: 'Two charges +q and −q separated by distance d. Dipole moment p = q × d (vector from − to +).'
    },
    {
      id: 'conductor-properties',
      title: 'Conductor Properties',
      content: 'Allow free movement of electrons. Inside a conductor: E = 0. Charges reside only on the surface in electrostatic equilibrium.'
    },
    {
      id: 'insulator-properties',
      title: 'Insulator Properties',
      content: 'Electrons are tightly bound. Do not allow charge flow.'
    },
    {
      id: 'electrostatic-shielding',
      title: 'Electrostatic Shielding',
      content: 'Interior of a closed conductor has zero electric field—protects sensitive equipment.'
    },
    {
      id: 'charging-methods',
      title: 'Charging Methods',
      content: '1. Friction (rubbing)\n2. Conduction (touching)\n3. Induction (without touching)\n\nFriction produces frictional electricity.'
    },
    {
      id: 'uniform-field',
      title: 'Field Lines in Uniform Field',
      content: 'Parallel, equally spaced, straight lines.'
    },
    {
      id: 'superposition-principle',
      title: 'Superposition Principle',
      content: 'Net electric field or force = vector sum of individual fields or forces from each charge.'
    },
    {
      id: 'force-vs-distance',
      title: 'Force vs Distance',
      content: 'If distance doubles → F becomes ¼. (From inverse-square law)'
    },
    {
      id: 'charge-density',
      title: 'Charge Density',
      content: 'Surface charge density = charge per unit area. Unit: C/m².'
    },
    {
      id: 'conducting-sphere',
      title: 'Conducting Sphere Charge Distribution',
      content: 'Charge spreads equally on surface; zero inside.'
    },
    {
      id: 'electron-charge',
      title: 'Electron Charge',
      content: 'Electron carries −e, where e = 1.6×10⁻¹⁹ C.'
    },
    {
      id: 'test-charge-movement',
      title: 'Test Charge Movement',
      content: 'A positive test charge moves along the electric field direction, from high potential to low.'
    },
    {
      id: 'point-charge-field',
      title: 'Electric Field of Point Charge',
      content: 'Non-uniform; stronger near the charge, decreases with distance.'
    }
  ],
  lastUpdated: Date.now()
};

// Electrostatics Chapter containing the physics tests
const electrostaticsChapter: Chapter = {
  id: 'electrostatics',
  name: 'Electrostatics',
  tests: [
    {
      id: 'phy-ch1-potential',
      name: 'Electric Potential & Capacitance',
      studyMaterial: {
        sections: [
          {
            id: 'electric-potential',
            title: 'Electric Potential',
            content: 'Electric potential at a point is the amount of work done per unit charge in bringing a small test charge from infinity to that point. SI unit = Volt (V).'
          },
          {
            id: 'potential-difference',
            title: 'Potential Difference',
            content: 'Potential difference = Work done / charge moved between two points. It determines how strongly charges are pushed through a circuit.'
          },
          {
            id: 'potential-energy',
            title: 'Electric Potential Energy',
            content: 'Energy stored due to the position of charges in an electric field. Unit = Joule (J).'
          },
          {
            id: 'volt-definition',
            title: '1 Volt Definition',
            content: '1 Volt = 1 Joule per Coulomb (1 J/C). Means: one coulomb of charge gains 1 joule of energy.'
          },
          {
            id: 'work-done',
            title: 'Work Done in Uniform Electric Field',
            content: 'W = qEd, where q = charge, E = electric field, d = displacement along field direction.'
          },
          {
            id: 'zero-field-points',
            title: 'Electric Field Zero Points',
            content: 'Electric field becomes zero at special symmetry points, like the midpoint of a dipole.'
          },
          {
            id: 'equipotential-surfaces',
            title: 'Equipotential Surfaces',
            content: 'Surfaces on which electric potential is same everywhere. Always perpendicular to electric field lines. No work is done moving along an equipotential.'
          },
          {
            id: 'potential-inside-conductor',
            title: 'Potential Inside Conductor',
            content: 'Inside a conductor in electrostatic equilibrium, potential is constant. Therefore E = 0.'
          },
          {
            id: 'potential-point-charge',
            title: 'Potential of Point Charge',
            content: 'V ∝ 1/r. Potential decreases as distance from charge increases.'
          },
          {
            id: 'dipole-field',
            title: 'Electric Dipole Field',
            content: 'Dipole electric field is strongest along the axial line (line joining the charges).'
          },
          {
            id: 'infinite-plane-field',
            title: 'Infinite Plane Sheet Field',
            content: 'Electric field of infinite charged sheet is constant, independent of distance.'
          },
          {
            id: 'capacitance-basics',
            title: 'Capacitance',
            content: 'Ability to store electric charge. SI unit = Farad (F). Depends on geometry and medium.'
          },
          {
            id: 'capacitor-basics',
            title: 'Capacitor',
            content: 'A device storing both charge and electric energy. Used for smoothing, filtering, timing circuits.'
          },
          {
            id: 'capacitance-factors',
            title: 'Factors Increasing Capacitance',
            content: '1. Increased plate area → more charge storage\n2. Decreased distance between plates\n3. Higher dielectric constant (K) between plates'
          },
          {
            id: 'dielectric-effect',
            title: 'Effect of Dielectric',
            content: 'A dielectric reduces the electric field and potential, thereby increasing capacitance.'
          },
          {
            id: 'polarization',
            title: 'Electric Polarization',
            content: 'Occurs in dielectrics, where molecules get slightly displaced, creating induced dipoles.'
          },
          {
            id: 'charged-ring-field',
            title: 'Field at Center of Charged Ring',
            content: 'Net electric field is zero because the contributions from all ring elements cancel out by symmetry.'
          },
          {
            id: 'spherical-capacitance',
            title: 'Capacitance of Spherical Conductor',
            content: 'C ∝ radius of the sphere. Larger sphere → higher capacitance.'
          },
          {
            id: 'capacitor-energy',
            title: 'Energy Stored in a Capacitor',
            content: 'U = ½ C V². Represents electrostatic energy stored due to separation of charges.'
          }
        ],
        lastUpdated: Date.now()
      },
      questions: [
        {
          id: 'cuet-phy-potential-q1',
          question: 'Electric potential is measured in',
          options: ['watt', 'volt', 'coulomb', 'newton'],
          correctAnswer: 1,
          explanation: 'The SI unit of electric potential is the volt (V).'
        },
        {
          id: 'cuet-phy-potential-q2',
          question: 'Potential difference is work done per',
          options: ['unit charge', 'unit mass', 'unit time', 'unit distance'],
          correctAnswer: 0,
          explanation: 'Potential difference is defined as work done per unit charge.'
        },
        {
          id: 'cuet-phy-potential-q3',
          question: 'Work done in moving charge in uniform field is',
          options: ['q/E', 'Ed', 'qEd', 'q/d'],
          correctAnswer: 2,
          explanation: 'Work done W = qEd, where q is charge, E is field, and d is displacement.'
        },
        {
          id: 'cuet-phy-potential-q4',
          question: '1 volt equals',
          options: ['1 J/C', '1 C/J', '1 N/C', '1 Nm'],
          correctAnswer: 0,
          explanation: '1 volt = 1 joule per coulomb (1 J/C).'
        },
        {
          id: 'cuet-phy-potential-q5',
          question: 'Unit of electric potential energy is',
          options: ['J', 'C', 'N', 'W'],
          correctAnswer: 0,
          explanation: 'Electric potential energy is measured in joules (J).'
        },
        {
          id: 'cuet-phy-potential-q6',
          question: 'Electric field is zero at',
          options: ['midpoint of dipole', 'infinity', 'near positive charge', 'anywhere'],
          correctAnswer: 0,
          explanation: 'At the midpoint of a dipole, the electric fields from the two equal and opposite charges cancel out.'
        },
        {
          id: 'cuet-phy-potential-q7',
          question: 'Equipotential surfaces are always',
          options: ['parallel', 'perpendicular to field lines', 'slanted', 'curved randomly'],
          correctAnswer: 1,
          explanation: 'Equipotential surfaces are always perpendicular to electric field lines.'
        },
        {
          id: 'cuet-phy-potential-q8',
          question: 'Electric potential inside a conductor is',
          options: ['variable', 'infinite', 'zero', 'constant'],
          correctAnswer: 3,
          explanation: 'Inside a conductor in electrostatic equilibrium, the potential is constant.'
        },
        {
          id: 'cuet-phy-potential-q9',
          question: 'Electric potential outside a point charge decreases as',
          options: ['1/r', 'r', '1/r²', 'r²'],
          correctAnswer: 0,
          explanation: 'Electric potential V ∝ 1/r for a point charge.'
        },
        {
          id: 'cuet-phy-potential-q10',
          question: 'Electric dipole field is strongest at',
          options: ['equatorial point', 'axial point', 'infinity', 'center'],
          correctAnswer: 1,
          explanation: 'The electric field of a dipole is strongest along the axial line.'
        },
        {
          id: 'cuet-phy-potential-q11',
          question: 'Electric field of infinite plane sheet is',
          options: ['zero', 'constant', 'varies with distance', 'zero at center'],
          correctAnswer: 1,
          explanation: 'An infinite plane sheet produces a constant electric field.'
        },
        {
          id: 'cuet-phy-potential-q12',
          question: 'SI unit of capacitance is',
          options: ['ohm', 'farad', 'henry', 'tesla'],
          correctAnswer: 1,
          explanation: 'The SI unit of capacitance is the farad (F).'
        },
        {
          id: 'cuet-phy-potential-q13',
          question: 'Capacitor stores',
          options: ['charge only', 'energy only', 'charge & energy', 'protons only'],
          correctAnswer: 2,
          explanation: 'A capacitor stores both electric charge and electric energy.'
        },
        {
          id: 'cuet-phy-potential-q14',
          question: 'Capacitance increases when plate area',
          options: ['increases', 'decreases', 'remains same', 'shrinks'],
          correctAnswer: 0,
          explanation: 'Capacitance is directly proportional to the plate area.'
        },
        {
          id: 'cuet-phy-potential-q15',
          question: 'Capacitance decreases when distance between plates',
          options: ['increases', 'decreases', 'stays same', 'halves'],
          correctAnswer: 0,
          explanation: 'Capacitance is inversely proportional to the distance between plates.'
        },
        {
          id: 'cuet-phy-potential-q16',
          question: 'Dielectric increases capacitance by reducing',
          options: ['charge', 'potential', 'field', 'energy'],
          correctAnswer: 1,
          explanation: 'Dielectric reduces the potential difference, thereby increasing capacitance.'
        },
        {
          id: 'cuet-phy-potential-q17',
          question: 'Electric polarization occurs in a',
          options: ['conductor', 'metal', 'dielectric', 'vacuum'],
          correctAnswer: 2,
          explanation: 'Electric polarization occurs in dielectric materials.'
        },
        {
          id: 'cuet-phy-potential-q18',
          question: 'Electric field at the center of a charged ring is',
          options: ['maximum', 'zero', 'minimum', 'infinite'],
          correctAnswer: 1,
          explanation: 'Due to symmetry, the electric field at the center of a charged ring is zero.'
        },
        {
          id: 'cuet-phy-potential-q19',
          question: 'Capacitance of spherical conductor depends on',
          options: ['mass', 'radius', 'thickness', 'charge type'],
          correctAnswer: 1,
          explanation: 'Capacitance of a spherical conductor is directly proportional to its radius.'
        },
        {
          id: 'cuet-phy-potential-q20',
          question: 'Energy stored in capacitor is',
          options: ['½CV²', 'CV', 'V/I', 'C/V'],
          correctAnswer: 0,
          explanation: 'The energy stored in a capacitor is given by U = ½CV².'
        }
      ]
    },
    {
      id: 'phy-ch1-easy',
      name: 'Electric Charge & Field (Easy)',
      studyMaterial: electricChargesStudyMaterial,
      questions: [
        {
          id: 'cuet-phy-ch1-q1',
          question: 'Electric charge is measured in',
          options: ['newton', 'volt', 'coulomb', 'ampere'],
          correctAnswer: 2,
          explanation: 'Coulomb is the SI unit of electric charge.'
        },
        {
          id: 'cuet-phy-ch1-q2',
          question: 'Like charges',
          options: ['neutralize', 'stop moving', 'repel', 'attract'],
          correctAnswer: 2,
          explanation: 'Like charges repel due to having the same sign.'
        },
        {
          id: 'cuet-phy-ch1-q3',
          question: 'The SI unit of electric field is',
          options: ['C·m', 'N/C', 'C/N', 'J/C'],
          correctAnswer: 1,
          explanation: 'Electric field intensity is measured in newton per coulomb (N/C).'
        },
        {
          id: 'cuet-phy-ch1-q4',
          question: 'A positively charged body has',
          options: ['extra neutrons', 'deficit of electrons', 'excess electrons', 'protons removed'],
          correctAnswer: 1,
          explanation: 'Positive charge = electron deficiency.'
        },
        {
          id: 'cuet-phy-ch1-q5',
          question: 'Charging by rubbing is called',
          options: ['induction', 'polarization', 'frictional electrification', 'conduction'],
          correctAnswer: 2,
          explanation: 'Rubbing transfers electrons (friction).'
        },
        {
          id: 'cuet-phy-ch1-q6',
          question: 'The force between two charges in vacuum is given by',
          options: ['Faraday law', 'Gauss law', 'Coulomb\'s law', 'Ohm\'s law'],
          correctAnswer: 2,
          explanation: 'Coulomb\'s law defines force between charges.'
        },
        {
          id: 'cuet-phy-ch1-q7',
          question: 'Electrostatic force varies as',
          options: ['r', 'r²', '1/r²', '1/r'],
          correctAnswer: 2,
          explanation: 'Force ∝ 1/r².'
        },
        {
          id: 'cuet-phy-ch1-q8',
          question: 'Coulomb constant k equals',
          options: ['10³ Nm²/C²', '9×10⁶ Nm²/C²', '1 Nm²/C²', '9×10⁹ Nm²/C²'],
          correctAnswer: 3,
          explanation: 'Standard value of Coulomb constant.'
        },
        {
          id: 'cuet-phy-ch1-q9',
          question: 'Electric lines of force originate from',
          options: ['neutral body', 'negative charge', 'both', 'positive charge'],
          correctAnswer: 3,
          explanation: 'Electric lines start from + charge.'
        },
        {
          id: 'cuet-phy-ch1-q10',
          question: 'Electric lines of force terminate on',
          options: ['none', 'both', 'negative', 'positive'],
          correctAnswer: 2,
          explanation: 'Terminate on − charge.'
        },
        {
          id: 'cuet-phy-ch1-q11',
          question: 'Electric flux is measured in',
          options: ['J', 'C', 'N/C', 'Nm²/C'],
          correctAnswer: 3,
          explanation: 'Φ is measured in Nm²/C.'
        },
        {
          id: 'cuet-phy-ch1-q12',
          question: 'Two charges +q and −q form a',
          options: ['capacitor', 'insulator', 'dipole', 'conductor'],
          correctAnswer: 2,
          explanation: 'A pair of +q, −q is dipole.'
        },
        {
          id: 'cuet-phy-ch1-q13',
          question: 'Dipole moment p equals',
          options: ['q/d', 'q+d', 'd/q', 'q×d'],
          correctAnswer: 3,
          explanation: 'p = qd.'
        },
        {
          id: 'cuet-phy-ch1-q14',
          question: 'The SI unit of dipole moment is',
          options: ['C', 'Nm', 'C·m', 'C/m'],
          correctAnswer: 2,
          explanation: 'Dipole moment unit is coulomb-meter.'
        },
        {
          id: 'cuet-phy-ch1-q15',
          question: 'Electric field inside a conductor is',
          options: ['maximum', 'infinite', 'varies', 'zero'],
          correctAnswer: 3,
          explanation: 'Field inside conductor = 0 (electrostatic equilibrium).'
        },
        {
          id: 'cuet-phy-ch1-q16',
          question: 'SI unit of permittivity ε₀ is',
          options: ['N/C', 'C/m²', 'J/C', 'C²/N·m²'],
          correctAnswer: 3,
          explanation: 'ε₀ has unit C²/N·m².'
        },
        {
          id: 'cuet-phy-ch1-q17',
          question: 'When distance between two charges doubles, the force becomes',
          options: ['half', '4 times', 'double', '1/4th'],
          correctAnswer: 3,
          explanation: 'Force becomes 1/4th.'
        },
        {
          id: 'cuet-phy-ch1-q18',
          question: 'Charge on an electron is',
          options: ['0', '2e', '+e', '−e'],
          correctAnswer: 3,
          explanation: 'Electron has charge −1.6×10⁻¹⁹ C.'
        },
        {
          id: 'cuet-phy-ch1-q19',
          question: 'Electric flux through a closed surface depends on',
          options: ['area only', 'medium only', 'charge enclosed', 'temperature'],
          correctAnswer: 2,
          explanation: 'Flux depends only on charge enclosed.'
        },
        {
          id: 'cuet-phy-ch1-q20',
          question: 'In a uniform electric field, field lines are',
          options: ['random', 'curved', 'circular', 'straight'],
          correctAnswer: 3,
          explanation: 'Uniform field = parallel straight lines.'
        },
        {
          id: 'cuet-phy-ch1-q21',
          question: 'Gauss law relates electric flux with',
          options: ['mass', 'time', 'force', 'enclosed charge'],
          correctAnswer: 3,
          explanation: 'Gauss law: Φ = q/ε₀.'
        },
        {
          id: 'cuet-phy-ch1-q22',
          question: 'A conductor allows',
          options: ['only protons move', 'only electrons fixed', 'no charge movement', 'free movement of charges'],
          correctAnswer: 3,
          explanation: 'Conductors allow free movement of electrons.'
        },
        {
          id: 'cuet-phy-ch1-q23',
          question: 'An insulator has',
          options: ['no atoms', 'mobile protons', 'bound electrons', 'free electrons'],
          correctAnswer: 2,
          explanation: 'Insulators have bound electrons.'
        },
        {
          id: 'cuet-phy-ch1-q24',
          question: 'Frictional electricity is generated due to',
          options: ['cooling', 'heating', 'rubbing', 'bending'],
          correctAnswer: 2,
          explanation: 'Rubbing → charge transfer.'
        },
        {
          id: 'cuet-phy-ch1-q25',
          question: 'The SI unit of electric flux density is',
          options: ['N·m²/C', 'N/C', 'J/m', 'C/m²'],
          correctAnswer: 3,
          explanation: 'σ = charge/area.'
        },
        {
          id: 'cuet-phy-ch1-q26',
          question: 'If charge q on a source increases, the electric field',
          options: ['becomes zero', 'decreases', 'fluctuates', 'increases'],
          correctAnswer: 3,
          explanation: 'E ∝ q.'
        },
        {
          id: 'cuet-phy-ch1-q27',
          question: 'The inverse square law applies to',
          options: ['current', 'pressure', 'light', 'Coulomb force'],
          correctAnswer: 3,
          explanation: 'Coulomb force ∝ 1/r².'
        },
        {
          id: 'cuet-phy-ch1-q28',
          question: 'Charges +Q and −Q placed close together form a',
          options: ['capacitor', 'magnet', 'conductor', 'dipole'],
          correctAnswer: 3,
          explanation: 'Opposite charges near each other → dipole.'
        },
        {
          id: 'cuet-phy-ch1-q29',
          question: 'Direction of electric field is taken from',
          options: ['anywhere', 'north to south', '− to +', '+ to −'],
          correctAnswer: 3,
          explanation: 'From positive to negative.'
        },
        {
          id: 'cuet-phy-ch1-q30',
          question: 'Electric field inside a cavity of a conductor is',
          options: ['decreases', 'unpredictable', 'increases', 'zero'],
          correctAnswer: 3,
          explanation: 'Zero due to shielding.'
        },
        {
          id: 'cuet-phy-ch1-q31',
          question: 'Electric flux through a closed surface depends on',
          options: ['shape', 'net charge enclosed', 'volume', 'size'],
          correctAnswer: 1,
          explanation: 'Only depends on enclosed charge.'
        },
        {
          id: 'cuet-phy-ch1-q32',
          question: 'Superposition principle applies to',
          options: ['charges only', 'forces only', 'electric field', 'field & force'],
          correctAnswer: 3,
          explanation: 'Both fields and resulting forces follow superposition.'
        },
        {
          id: 'cuet-phy-ch1-q33',
          question: 'Two negative charges',
          options: ['no force', 'repel', 'attract', 'follow magnetism'],
          correctAnswer: 1,
          explanation: 'Similar charges repel.'
        },
        {
          id: 'cuet-phy-ch1-q34',
          question: 'Electric dipole moment is a vector drawn from',
          options: ['center to +', 'neutral to charge', '+ to −', '− to +'],
          correctAnswer: 3,
          explanation: 'Dipole vector is − to +.'
        },
        {
          id: 'cuet-phy-ch1-q35',
          question: 'A Gauss surface must be',
          options: ['solid metal', 'fixed shape', 'conducting', 'imaginary'],
          correctAnswer: 3,
          explanation: 'Gauss surface is imaginary.'
        },
        {
          id: 'cuet-phy-ch1-q36',
          question: 'Electric field is defined as',
          options: ['q/F', 'F/q', 'qd', 'd/q'],
          correctAnswer: 1,
          explanation: 'E = F/q.'
        },
        {
          id: 'cuet-phy-ch1-q37',
          question: 'The SI unit of Coulomb constant k is',
          options: ['C²/N·m²', 'N/m', 'N·m²/C²', 'N/C²'],
          correctAnswer: 2,
          explanation: 'k has unit Nm²/C².'
        },
        {
          id: 'cuet-phy-ch1-q38',
          question: 'Electric charge is a',
          options: ['tensor', 'vector', 'none', 'scalar'],
          correctAnswer: 3,
          explanation: 'Charge has magnitude only.'
        },
        {
          id: 'cuet-phy-ch1-q39',
          question: '1 microcoulomb (1 μC) equals',
          options: ['10⁶ C', '1 C', '10⁻³ C', '10⁻⁶ C'],
          correctAnswer: 3,
          explanation: '1 μC = 10⁻⁶ C.'
        },
        {
          id: 'cuet-phy-ch1-q40',
          question: 'A conducting sphere distributes charge',
          options: ['at center', 'inside only', 'equally on surface', 'unequally'],
          correctAnswer: 2,
          explanation: 'Charge distributes uniformly on surface.'
        },
        {
          id: 'cuet-phy-ch1-q41',
          question: 'Electric field due to a point charge is',
          options: ['zero', 'uniform', 'random', 'non-uniform'],
          correctAnswer: 3,
          explanation: 'Point charge field varies with distance.'
        },
        {
          id: 'cuet-phy-ch1-q42',
          question: 'The direction of test charge movement is in the direction of',
          options: ['insulation', 'higher potential', 'electric field', 'lower potential'],
          correctAnswer: 2,
          explanation: 'Test charge moves along electric field.'
        },
        {
          id: 'cuet-phy-ch1-q43',
          question: 'The work done to bring a charge in an electrostatic field is stored as',
          options: ['constant', 'energy', 'potential', 'force'],
          correctAnswer: 1,
          explanation: 'Work done is stored as potential energy.'
        },
        {
          id: 'cuet-phy-ch1-q44',
          question: 'Electrostatic shielding works in a',
          options: ['insulator', 'vacuum', 'glass', 'conductor'],
          correctAnswer: 3,
          explanation: 'Conductors block electric field.'
        },
        {
          id: 'cuet-phy-ch1-q45',
          question: 'Force between charges in a medium compared to vacuum is',
          options: ['Fvac × εr', 'F + εr', 'Fvac', 'Fvac/εr'],
          correctAnswer: 3,
          explanation: 'In medium F reduces by dielectric constant.'
        },
        {
          id: 'cuet-phy-ch1-q46',
          question: 'Dielectric constant K is defined as',
          options: ['q/ε₀', 'ε₀/ε', 'ε/ε₀', 'F/E'],
          correctAnswer: 2,
          explanation: 'K = ε/ε₀.'
        },
        {
          id: 'cuet-phy-ch1-q47',
          question: 'Net electric flux through a closed surface with no charge inside is',
          options: ['minimum', 'maximum', 'infinite', 'zero'],
          correctAnswer: 3,
          explanation: 'No charge enclosed → zero flux.'
        },
        {
          id: 'cuet-phy-ch1-q48',
          question: 'The SI unit of surface charge density σ is',
          options: ['C/m', 'C²', 'C/m³', 'C/m²'],
          correctAnswer: 3,
          explanation: 'Surface charge density is C/m².'
        },
        {
          id: 'cuet-phy-ch1-q49',
          question: 'The property that charge cannot be divided infinitely is called',
          options: ['conserved', 'neutral', 'quantized', 'discrete'],
          correctAnswer: 2,
          explanation: 'Charge exists in multiples of e.'
        },
        {
          id: 'cuet-phy-ch1-q50',
          question: 'A conductor in electrostatic equilibrium has charge',
          options: ['nowhere', 'inside only', 'both', 'only at surface'],
          correctAnswer: 3,
          explanation: 'All excess charge resides on surface.'
        },
        {
          id: 'test-1773155087464-q1',
          question: 'Which of the following is a unit of electric charge?',
          options: ['Newton', 'Coulomb', 'Joule', 'Watt'],
          correctAnswer: 1,
          explanation: 'The SI unit of electric charge is the Coulomb.'
        },
        {
          id: 'test-1773155087464-q2',
          question: 'What is the value of the elementary charge (e)?',
          options: ['1.6 x 10^-19 C', '9.1 x 10^-31 C', '6.6 x 10^-34 C', '1.6 x 10^19 C'],
          correctAnswer: 0,
          explanation: 'The elementary charge is approximately 1.6 x 10^-19 Coulombs.'
        },
        {
          id: 'test-1773155087464-q3',
          question: 'What happens to the electrostatic force if the distance between two charges is doubled?',
          options: ['It doubles', 'It becomes half', 'It becomes one-fourth', 'It remains the same'],
          correctAnswer: 2,
          explanation: 'According to Coulomb\'s Law, force is inversely proportional to the square of the distance (F ∝ 1/r²).'
        }
      ]
    },
    {
      id: 'test-1773155087464',
      name: `Current Electricity`,
      studyMaterial: {
        sections: [
          {
            id: 'section-0',
            title: `Study Material`,
            content: `<p><strong>Study Material</strong> :: <strong>Study Material</strong> :: <strong>Study Material</strong> :: <img src="https://mcavmkqvshgpzsfzhvud.supabase.co/storage/v1/object/public/study-images/images/1773155129948-8vajml5.png"></p><p><br></p><p><img src="https://mcavmkqvshgpzsfzhvud.supabase.co/storage/v1/object/public/study-images/images/1774450787610-yzwrtjr.png"></p>`
          }
        ],
        lastUpdated: 1774450949185
      },
      questions: []
    },
    {
      id: 'test-1770477504213',
      name: `Torque & Gauss's questions`,
      studyMaterial: {
        sections: [
          {
            id: 'section-0',
            title: `🔹 Torque on an Electric Dipole in Uniform Electric Field`,
            content: `<strong></strong>  <strong><em> </em></strong><p><strong><em>1️⃣ Electric Dipole kya hota hai?</em></strong></p><p><strong><em>Equal &amp; opposite charges (+q, −q)</em></strong></p><p><strong><em>Thoda sa distance d se alag</em></strong></p><p><strong><em>Example: +q —— d —— -q</em></strong></p><p><strong><em>👉 Dipole moment (p)</em></strong></p><p><strong><em>p=q×2a = q × d Direction: −q se +q ki taraf</em></strong></p>`
          },
          {
            id: 'section-1',
            title: `2️⃣ Uniform Electric Field kya hota hai?`,
            content: `<strong></strong>  <strong><em> </em></strong><p><strong><em>Field har jagah same hota hai</em></strong></p><p><strong><em>Lines parallel &amp; equally spaced</em></strong></p><p><strong><em>Example: parallel plates ke beech</em></strong></p>`
          },
          {
            id: 'section-2',
            title: `3️⃣ Torque kya hota hai yahan?`,
            content: `<strong></strong>  <strong><em> </em></strong><p><strong><em>Field dipole ko rotate krne ki koshish karta hai</em></strong></p><p><strong><em>+q aur −q pe forces equal &amp; opposite hoti hain</em></strong></p><p><strong><em>Net force = 0</em></strong></p><p><strong><em>BUT rotation hoti hai 👉 that is Torque</em></strong></p><p><br></p>`
          },
          {
            id: 'section-3',
            title: `4️⃣ IMPORTANT FORMULA (EXAM HEART ❤️)`,
            content: `<strong></strong>  <strong><em> τ=pEsin⁡θ</em></strong><p><strong><em>τ = torque</em></strong></p><p><strong><em>p = dipole moment</em></strong></p><p><strong><em>E = electric field</em></strong></p><p><strong><em>θ = angle between p and E</em></strong></p><p><br></p><p><img src="https://mcavmkqvshgpzsfzhvud.supabase.co/storage/v1/object/public/study-images/images/1775670459414-b64upload1.png"></p>`
          },
          {
            id: 'section-4',
            title: `Question`,
            content: `<p><strong>Question</strong> :: <strong>Question</strong> :: <strong>Question</strong> :: <strong>Question</strong> :: <strong>Question</strong> :: <img src="https://mcavmkqvshgpzsfzhvud.supabase.co/storage/v1/object/public/study-images/images/1775670462019-b64upload2.png"></p><p><br></p>`
          },
          {
            id: 'section-5',
            title: `Gauss Law`,
            content: `<strong></strong>  <strong><em> Electric flux through any closed surface is equal to enclosed charge divided by ε₀.</em></strong><p><strong><em> Formula: Φ = Q/ε₀</em></strong></p><p><strong><em> Remember: Only enclosed charge matters.</em></strong></p>`
          },
          {
            id: 'section-6',
            title: `Electric Flux Formula`,
            content: `<strong></strong>  <strong><em> Φ = EA cosθ</em></strong><p><strong><em> θ is angle between electric field and area vector.</em></strong></p><p><strong><em> 0° → Maximum</em></strong></p><p><strong><em> 90° → Zero</em></strong></p><p><strong><em> Trick: Flux = cos, Torque = sin.</em></strong></p>`
          },
          {
            id: 'section-7',
            title: `Closed vs Open Surface`,
            content: `<strong></strong> <p><strong><em> Closed surface → Flux depends only on enclosed charge.</em></strong></p><p><strong><em> Open surface → Depends on electric field and area.</em></strong></p>`
          },
          {
            id: 'section-8',
            title: `Spherical Shell Concept`,
            content: `<strong></strong> <p><strong><em> Inside a uniformly charged thin shell, electric field is zero.</em></strong></p><p><strong><em> Reason: Any Gaussian surface inside encloses zero charge.</em></strong></p>`
          },
          {
            id: 'section-9',
            title: `Zero Flux Meaning`,
            content: `<strong></strong> <p><strong><em> If net flux is zero → net enclosed charge is zero.</em></strong></p><p><strong><em> Does NOT mean electric field is zero everywhere.</em></strong></p>`
          },
          {
            id: 'section-10',
            title: `Flux Unit`,
            content: `<strong></strong>  <strong><em> Nm²/C</em></strong><p><strong><em> Think: E (N/C) × Area (m²)</em></strong></p>`
          },
          {
            id: 'section-11',
            title: `Gauss Law Trick`,
            content: `<strong></strong> <p><strong><em> Surface size, shape, orientation doesn't change total flux if enclosed charge same.</em></strong></p>`
          },
          {
            id: 'section-12',
            title: `Assertion–Reason Trick`,
            content: `<strong></strong> <p><strong><em> Always check:</em></strong></p><ol><li><strong><em>Are both statements true?</em></strong></li><li><strong><em>Does Reason logically explain Assertion?</em></strong></li></ol>`
          },
          {
            id: 'section-13',
            title: `CUET Trap Point`,
            content: `<strong></strong> <p><strong><em> Maximum flux at 0°</em></strong></p><p><strong><em> Many students mark 90° because they confuse with torque.</em></strong></p><p><br></p><p><img src="https://mcavmkqvshgpzsfzhvud.supabase.co/storage/v1/object/public/study-images/images/1771834773566-jogbohj.png"></p><p><br></p><p><img src="https://mcavmkqvshgpzsfzhvud.supabase.co/storage/v1/object/public/study-images/images/1771834806808-99597jo.png"></p><p><br></p><p><img src="https://mcavmkqvshgpzsfzhvud.supabase.co/storage/v1/object/public/study-images/images/1771860326940-ig27yez.png"></p><p><br></p><p><img src="https://mcavmkqvshgpzsfzhvud.supabase.co/storage/v1/object/public/study-images/images/1771861860742-rlem8td.png"></p><p><br></p>`
          }
        ],
        lastUpdated: 1771861869466
      },
      questions: [
        { id: 'q1770477566877_0', question: `An electric dipole is placed in a uniform electric field. The net force on the dipole is:`, options: ['Maximum', 'Minimum', 'Zero', 'Depends on angle'], correctAnswer: 2, explanation: `Uniform electric field me +q aur −q par forces equal and opposite hote hain, isliye net force zero hota hai. Angle pe depend nahi karta` },
        { id: 'q1770477566877_1', question: `Torque on an electric dipole is maximum when the angle between dipole moment and electric field is:`, options: ['0°', '30°', '60°', '90°'], correctAnswer: 3, explanation: `Torque τ = pE sinθ hota hai. sinθ maximum = 1 hota hai jab θ = 90°` },
        { id: 'q1770477566877_2', question: `If an electric dipole is aligned parallel to a uniform electric field, the torque acting on it is:`, options: ['pE', 'pE sinθ', 'Zero', 'Maximum'], correctAnswer: 2, explanation: `Parallel alignment ⇒ θ = 0° ⇒ sin0 = 0 ⇒ torque zero` },
        { id: 'q1770477566877_3', question: `The SI unit of electric dipole moment is:`, options: ['Coulomb', 'Coulomb / meter', 'Coulomb × meter', 'Newton × meter'], correctAnswer: 2, explanation: `Dipole moment p = q × separation, isliye unit = Coulomb × meter` },
        { id: 'q1770477566877_4', question: `Stable equilibrium of an electric dipole in a uniform electric field occurs when:`, options: ['θ = 90°', 'θ = 180°', 'θ = 0°', 'θ = 45°'], correctAnswer: 2, explanation: `Stable equilibrium tab hota hai jab dipole electric field ke parallel ho (θ = 0°)` },
        { id: 'q1770477566877_5', question: `An electric dipole has a dipole moment 4 × 10⁻⁹ C·m and is placed in a uniform electric field of 2 × 10⁵ N/C making an angle of 30° with the field. Find the torque acting on the dipole.`, options: ['2 × 10⁻⁴ N·m', '4 × 10⁻⁴ N·m', '8 × 10⁻⁴ N·m', '1 × 10⁻⁴ N·m'], correctAnswer: 1, explanation: `τ = pE sin30° = (4×10⁻⁹)(2×10⁵)(1/2) = 4×10⁻⁴ N·m` },
        { id: 'q1770477566877_6', question: `A dipole of moment 3 × 10⁻⁸ C·m is placed perpendicular to a uniform electric field of strength 10⁴ N/C. Find the torque.`, options: ['3 × 10⁻⁶ N·m', '3 × 10⁻⁵ N·m', '3 × 10⁻⁴ N·m', 'Zero'], correctAnswer: 2, explanation: `Perpendicular ⇒ θ = 90° ⇒ sin90 = 1 ⇒ τ = pE = 3×10⁻⁴ N·m` },
        { id: 'q1770477566877_7', question: `For which orientation of an electric dipole in a uniform electric field is the torque zero?`, options: ['When perpendicular to field', 'When at 45°', 'When parallel or anti-parallel to field', 'Torque is never zero'], correctAnswer: 2, explanation: `Torque zero hota hai jab dipole electric field ke parallel ya anti-parallel ho (θ = 0° ya 180°)` },
        { id: 'q1770477566877_8', question: `Assertion (A): Torque on an electric dipole in a uniform electric field is zero when it is aligned with the field. Reason (R): The forces on the two charges act along the same line.`, options: ['Both A and R are true and R is the correct explanation', 'Both A and R are true but R is not the correct explanation', 'A is true, R is false', 'A is false, R is true'], correctAnswer: 0, explanation: `Forces same line me act karti hain, moment arm zero hota hai, isliye torque zero hota hai` },
        { id: 'q1770995553009_0', question: `Electric flux through a closed surface depends only on which of the following?`, options: ['Shape of surface', 'Area of surface', 'Charge enclosed', 'Electric field outside'], correctAnswer: 2, explanation: `Gauss law → Φ = Q/ε₀ → depends only on enclosed charge` },
        { id: 'q1770995553009_1', question: `If the angle between electric field and area vector is 90°, electric flux will be:`, options: ['Maximum', 'Minimum', 'Zero', 'Infinite'], correctAnswer: 2, explanation: `Φ = EA cosθ → cos90° = 0` },
        { id: 'q1770995553009_2', question: `According to Gauss's law, the total electric flux through a closed surface equals:`, options: ['QE₀', 'Q/ε₀', 'ε₀/Q', 'Zero'], correctAnswer: 1, explanation: `Direct formula of Gauss law` },
        { id: 'q1770995553009_3', question: `If no charge is enclosed inside a closed surface, the electric flux is:`, options: ['Positive', 'Negative', 'Zero', 'Infinite'], correctAnswer: 2, explanation: `Qinside = 0 → flux = 0` },
        { id: 'q1770995553009_4', question: `A cube encloses a point charge Q. If the cube's side is doubled, the flux will:`, options: ['Double', 'Become half', 'Remain same', 'Become zero'], correctAnswer: 2, explanation: `Flux depends only on Q, not size` },
        { id: 'q1770995553009_5', question: `Electric field inside a uniformly charged thin spherical shell is:`, options: ['Maximum', 'Infinite', 'Zero', 'Depends on radius'], correctAnswer: 2, explanation: `Inside shell → enclosed charge = 0` },
        { id: 'q1770995553009_6', question: `Electric flux is a:`, options: ['Scalar quantity', 'Vector quantity', 'Tensor', 'Dimensionless'], correctAnswer: 0, explanation: `Flux is dot product → scalar` },
        { id: 'q1770995553009_7', question: `If a surface encloses +Q and –Q of equal magnitude, the net flux will be:`, options: ['Q/ε₀', '–Q/ε₀', 'Zero', 'Infinite'], correctAnswer: 2, explanation: `Net charge zero → flux zero` },
        { id: 'q1770995553009_8', question: `Electric flux is maximum when angle between E and area vector is:`, options: ['0°', '30°', '60°', '90°'], correctAnswer: 0, explanation: `cos0° = 1 → maximum` },
        { id: 'q1770995553009_9', question: `Unit of electric flux is:`, options: ['N/C', 'Nm²/C', 'NC/m²', 'Joule'], correctAnswer: 1, explanation: `From Φ = EA → unit Nm²/C` },
        { id: 'q1770995553009_10', question: `Assertion (A): Electric flux through a closed surface does not depend on shape. Reason (R): Gauss law depends only on enclosed charge.`, options: ['Both A and R true, R correct explanation', 'Both true but R not correct explanation', 'A true, R false', 'A false, R true'], correctAnswer: 0, explanation: `Shape doesn't matter, only Q matters` },
        { id: 'q1770995553009_11', question: `Assertion (A): Electric field inside a conductor in electrostatic equilibrium is zero. Reason (R): Charges reside on surface of conductor.`, options: ['Both A and R true, R correct explanation', 'Both true but R not correct explanation', 'A true, R false', 'A false, R true'], correctAnswer: 0, explanation: `No internal field because charges shift to surface` },
        { id: 'q1770995553009_12', question: `A spherical surface encloses 4×10⁻⁶ C. Electric flux will be:`, options: ['4×10⁶', '(4×10⁻⁶)/ε₀', '4ε₀', 'Zero'], correctAnswer: 1, explanation: `Direct Gauss formula` },
        { id: 'q1770995553009_13', question: `If enclosed charge is doubled, electric flux will:`, options: ['Remain same', 'Become half', 'Double', 'Become zero'], correctAnswer: 2, explanation: `Φ ∝ Q` },
        { id: 'q1770995553009_14', question: `If electric field is parallel to surface, flux will be:`, options: ['Maximum', 'Zero', 'Infinite', 'Depends on area'], correctAnswer: 1, explanation: `Field parallel → θ=90° → cos90=0` },
        { id: 'q1770995553009_15', question: `Flux through an open surface depends on:`, options: ['Enclosed charge only', 'Electric field and area', 'Shape only', 'Volume only'], correctAnswer: 1, explanation: `Open surface → depends on E and A` },
        { id: 'q1770995553009_16', question: `Gauss law is valid for:`, options: ['Only spherical surfaces', 'Only symmetrical surfaces', 'Any closed surface', 'Only cube'], correctAnswer: 2, explanation: `Works for any closed surface` },
        { id: 'q1770995553009_17', question: `The SI unit of ε₀ is:`, options: ['C²/Nm²', 'Nm²/C²', 'N/C', 'C/N'], correctAnswer: 2, explanation: `ε₀ unit derived from Coulomb law` },
        { id: 'q1770995553009_18', question: `If flux through closed surface is zero, then:`, options: ['No charge anywhere', 'No charge inside', 'No electric field', 'Surface is conductor'], correctAnswer: 1, explanation: `Zero flux → zero enclosed charge` },
        { id: 'q1770995553009_19', question: `Electric field lines are:`, options: ['Always closed loops', 'Start and end on charges', 'Parallel always', 'Circular always'], correctAnswer: 1, explanation: `Field lines begin on + and end on –` }
      ]
    },
    {
      id: 'test-1770187782888',
      name: `Coulomb's Questions`,
      studyMaterial: {
        sections: [
          { id: 'section-0', title: `Electric Charge`, content: `<strong></strong>  Electric charge ek physical quantity hai jiske wajah se electrostatic force lagti hai. Charge do type ka hota hai – positive (proton) aur negative (electron). Electron ka charge −1.6×10⁻¹⁹ C hota hai aur proton ka +1.6×10⁻¹⁹ C hota hai. Yaad rakhne ka trick: "1.6×10⁻¹⁹ = fundamental charge".` },
          { id: 'section-1', title: `Coulomb's Law`, content: `<strong></strong>  Do point charges ke beech lagne wali electrostatic force charges ke product ke directly proportional aur distance ke square ke inversely proportional hoti hai. Formula: F = k q₁q₂ / r² Yahan k = 9×10⁹ N m²/C² hota hai. Ye formula numericals ka base hai.` },
          { id: 'section-2', title: `Coulomb's Law (Effects)`, content: `<strong></strong>  Force between two point charges is F = k q₁q₂ / r²<p><strong>Effect of Change in Charge</strong>: Agar charge double/triple ho → force bhi utna hi times badhta hai 👉 Charge ×n ⇒ Force×n</p><p><strong>Effect of Change in Distance</strong>: Distance ×2 ⇒ Force ÷4 Distance ÷2 ⇒ Force ×4</p><p><strong>Medium Effect:</strong> k = 1 / (4πϵ) Medium change ⇒ permittivity change ⇒ force change 100%</p>` },
          { id: 'section-3', title: `Increase Trick`, content: `<strong></strong>  100% increase matlab double, triple nahi r → 2r ⇒ F → F/4` },
          { id: 'section-4', title: `Identical Charges Concept`, content: `<strong></strong>  Force exist karne ke liye do charges zaroori Ek hata diya ⇒ interaction khatam` },
          { id: 'section-5', title: `CUET Tip 🔥`, content: `<strong></strong>  Numericals se pehle hamesha ratio method try karo Fast + less calculation + kam silly mistake` },
          { id: 'section-6', title: `Dependence on Charge`, content: `<strong></strong>  Electrostatic force charge ke product pe depend karti hai. Agar ek charge double kar do to force bhi double ho jaati hai. Agar dono charges double kar do to force 4 times ho jaati hai. Agar ek charge zero ho jaaye to force zero ho jaati hai.` },
          { id: 'section-7', title: `Dependence on Distance`, content: `<strong></strong>  Force distance ke square ke inversely proportional hoti hai. Distance double ⇒ force 1/4 Distance half ⇒ force 4 times Distance triple ⇒ force 1/9 Yaad rakhne ka trick: "Distance square mein badlegi, force square mein ulta badlegi".` },
          { id: 'section-8', title: `Nature of Electrostatic Force`, content: `<strong></strong>  Like charges ( + + ya − − ) hamesha ek-dusre ko repel karti hain. Unlike charges ( + − ) hamesha ek-dusre ko attract karti hain. Yaad rakhne ka trick: "Like = door bhaago, Unlike = paas aao".` },
          { id: 'section-9', title: `Direction of Electrostatic Force`, content: `<strong></strong>  Electrostatic force hamesha dono charges ko join karne wali straight line ke along act karti hai. MCQ mein seedha poochha jaata hai: force acts along straight line joining charges.` },
          { id: 'section-10', title: `Effect of Medium`, content: `<strong></strong>  Electrostatic force medium pe depend karti hai. Vacuum ya air ko reference medium maana jaata hai. Air aur vacuum mein force almost same hoti hai, lekin dusre media mein force kam ho jaati hai.` },
          { id: 'section-11', title: `Non-Contact Force`, content: `<strong></strong>  Electrostatic force bina kisi physical contact ke lagti hai. Isliye ise non-contact force kehte hain. Friction jaise forces contact force hoti hain, lekin electrostatic nahi.` },
          { id: 'section-12', title: `Validity of Coulomb's Law`, content: `<strong></strong>  Coulomb's law sirf point charges ke liye valid hoti hai. Large size ke charged bodies ke liye directly apply nahi hoti. Exam mein direct MCQ aata hai: "Valid for point charges".` },
          { id: 'section-13', title: `Strength of Electrostatic Force`, content: `<strong></strong>  Electrostatic force gravitational force se kaafi zyada strong hoti hai. Isi wajah se atoms ke andar electrons nucleus se tightly bound rehte hain. CUET mein comparison wala MCQ common hai.` },
          { id: 'section-14', title: `Common Mistakes to Avoid`, content: `<strong></strong>  Distance double karne par force double nahi hoti, balki 1/4 ho jaati hai. Ek charge double karne par force 4 times nahi hoti, sirf double hoti hai. Like charges attract nahi karte, repel karte hain.` },
          { id: 'section-15', title: `Quick Revision Sheet`, content: `<strong></strong>  F = k q₁q₂ / r² k = 9×10⁹ Like → Repel Unlike → Attract Distance ↑ ⇒ Force ↓ (square rule) Electrostatic force = Non-contact force.` },
          { id: 'section-16', title: `🔁 COULOMB vs ELECTRIC FIELD`, content: `<strong></strong>  Coulomb Force: Depends on two charges, Formula: F = k q1 q2 / r², Unit: Newton. Electric Field: Depends on one charge, Formula: E = k q / r², Unit: N/C` },
          { id: 'section-17', title: `1️⃣ FORCES BETWEEN MULTIPLE CHARGES`, content: `<strong></strong> <h3>🔹 Idea kya hai?</h3><p>👉 Agar <strong>2 se zyada charges</strong> hain, to <strong>net force = sab forces ka vector sum</strong></p><p>🧠 "Ek-ek charge ka force nikaal, phir add kar." Formula: F = k q1q2/r²</p>` },
          { id: 'section-18', title: `2️⃣ SUPERPOSITION PRINCIPLE (VERY VERY IMP)`, content: `<strong></strong> <h3>🔹 Definition (1 line – exam ready)</h3><p>👉 <strong>Net force/field = algebraic (vector) sum of individual forces/fields</strong></p><p>🧠 "Alag-alag calculate kar, phir jod."</p>` },
          { id: 'section-19', title: `🔹 Dipole Moment (IMPORTANT)`, content: `<strong></strong> <ul><li>p=q×2a</li><li>Direction: <strong>−q se +q ki taraf</strong></li><li>Unit: <strong>C·m</strong></li></ul><p><strong>"Dipole moment = charge × separation"</strong></p><h3>🔹 CUET favourite result</h3><ul><li>Midpoint: Potential = 0, Electric field ≠ 0 (maximum)</li><li>Dipole moment vector → <strong>− to +</strong></li></ul>` },
          { id: 'section-20', title: `4️⃣ CONTINUOUS CHARGE DISTRIBUTION`, content: `<strong></strong>  <em>(CUET mein light concept)</em><h3>🔹 Matlab? — Charge point pe nahi, balki rod/ring/surface pe</h3><ul><li>Linear charge density: λ=Q/L</li><li>Surface charge density: σ=Q/A</li><li>Volume charge density: ρ=Q/V</li></ul><p>👉 Mostly <strong>definition / unit</strong> aata hai, heavy integral nahi.</p>` },
          { id: 'section-21', title: `Question Images`, content: `<strong></strong> <p><img src="https://mcavmkqvshgpzsfzhvud.supabase.co/storage/v1/object/public/study-images/images/1775670463612-b64upload3.png"></p><p><img src="https://mcavmkqvshgpzsfzhvud.supabase.co/storage/v1/object/public/study-images/images/1775670464552-b64upload4.png"></p>` }
        ],
        lastUpdated: 1770824593852
      },
      questions: [
        { id: 'q1770824593848_0', question: `Two point charges of +4 μC and +6 μC are placed 2 m apart in air. Calculate the electrostatic force between them.`, options: ['0.054 N', '0.108 N', '0.216 N', '1.08 N'], correctAnswer: 0, explanation: `Coulomb's law: F = kq₁q₂/r². Given charges and distance put directly, answer 0.108 N aata hai.` },
        { id: 'q1770824593848_1', question: `Two charges are separated by a distance r. If the distance is tripled, the electrostatic force becomes:`, options: ['3F', '9F', 'F/3', 'F/9'], correctAnswer: 3, explanation: `Force ∝ 1/r². Distance 3 times ⇒ force = 1/(3²) = 1/9 ⇒ F/9.` },
        { id: 'q1770824593848_2', question: `A charge of +8 μC is placed near a charge of −3 μC. The force between them is:`, options: ['Attractive', 'Repulsive', 'Zero', 'Depends on distance'], correctAnswer: 0, explanation: `Ek charge positive aur dusra negative hai. Unlike charges hamesha attract karte hain.` },
        { id: 'q1770824593848_3', question: `Two charges at a distance of 4 m exert a force F. What will be the force when distance becomes 2 m?`, options: ['F/4', 'F/2', '2F', '4F'], correctAnswer: 3, explanation: `Force ∝ 1/r². Distance 4 m se 2 m ho gayi (half), so force = (4/2)² = 4 times ⇒ 4F.` },
        { id: 'q1770824593848_4', question: `Two identical charges repel with force 1 N. If one charge is made three times and distance same, new force is:`, options: ['1 N', '2 N', '3 N', '9 N'], correctAnswer: 2, explanation: `Coulomb force ∝ q₁q₂. Ek charge 3 times hua, dusra same ⇒ force bhi 3 times ho jaata hai.` },
        { id: 'q1770824593848_5', question: `The SI unit of electric charge is:`, options: ['Coulomb', 'Ampere', 'Newton', 'Volt'], correctAnswer: 0, explanation: `Electric charge ki SI unit Coulomb hoti hai. Ye direct theory based question hai.` },
        { id: 'q1770824593848_6', question: `The value of Coulomb constant (k) is:`, options: ['9×10⁹ N m²/C²', '9×10⁻⁹ N m²/C²', '1.6×10⁻¹⁹ C', '8.85×10⁻¹² C²/Nm²'], correctAnswer: 0, explanation: `Coulomb constant ka standard value k = 9×10⁹ N m²/C² hota hai.` },
        { id: 'q1770824593848_7', question: `If force between two charges is F, what happens if both charges are doubled?`, options: ['F', '2F', '4F', 'F/4'], correctAnswer: 2, explanation: `Force ∝ q₁q₂. Dono charges double ⇒ (2q₁)(2q₂) = 4q₁q₂ ⇒ force 4F.` },
        { id: 'q1770824593848_8', question: `Two charges +2 μC and +2 μC are placed close. Nature of force is:`, options: ['Attractive', 'Repulsive', 'Zero', 'Gravitational'], correctAnswer: 1, explanation: `Dono charges positive hain. Like charges hamesha repel karte hain.` },
        { id: 'q1770824593848_9', question: `Electrostatic force acts along:`, options: ['Straight line joining charges', 'Circular path', 'Random direction', 'Magnetic field lines'], correctAnswer: 0, explanation: `Electrostatic force hamesha dono charges ko join karne wali straight line ke along act karta hai.` },
        { id: 'q1770824593848_10', question: `If distance between two charges is reduced to half, force becomes:`, options: ['F/2', '2F', '4F', 'F/4'], correctAnswer: 2, explanation: `Force ∝ 1/r². Distance half ⇒ force = (1/(1/2)²) = 4 times.` },
        { id: 'q1770824593848_11', question: `Which force is stronger in nature?`, options: ['Gravitational', 'Electrostatic', 'Magnetic', 'Nuclear'], correctAnswer: 1, explanation: `Electrostatic force gravitational force se kaafi zyada strong hoti hai.` },
        { id: 'q1770824593848_12', question: `Force between unlike charges is always:`, options: ['Repulsive', 'Zero', 'Attractive', 'Variable'], correctAnswer: 2, explanation: `Unlike charges ke beech force hamesha attractive hoti hai. No exception.` },
        { id: 'q1770824593848_13', question: `If one charge becomes zero, electrostatic force becomes:`, options: ['Infinite', 'Zero', 'Same', 'Doubled'], correctAnswer: 1, explanation: `Force ∝ q₁q₂. Agar ek charge zero ho jaaye ⇒ product zero ⇒ force zero.` },
        { id: 'q1770824593848_14', question: `Two charges exert force of 5 N. If distance is doubled, new force is:`, options: ['10 N', '5 N', '2.5 N', '1.25 N'], correctAnswer: 3, explanation: `Distance double ⇒ force 1/4 ho jaata hai. 5 N ÷ 4 = 1.25 N.` },
        { id: 'q1770824593848_15', question: `The charge on proton is:`, options: ['+1.6×10⁻¹⁹ C', '−1.6×10⁻¹⁹ C', '9×10⁹ C', '0 C'], correctAnswer: 0, explanation: `Proton ka charge +1.6×10⁻¹⁹ C hota hai. Ye fundamental fact hai.` },
        { id: 'q1770824593848_16', question: `Coulomb's law is valid for:`, options: ['Point charges', 'Large bodies', 'Current carrying wires', 'Magnets'], correctAnswer: 0, explanation: `Coulomb's law sirf point charges ke liye valid hota hai.` },
        { id: 'q1770824593848_17', question: `Which quantity affects Coulomb force?`, options: ['Charge', 'Distance', 'Medium', 'All of these'], correctAnswer: 3, explanation: `Force charge, distance aur medium teeno pe depend karti hai.` },
        { id: 'q1770824593848_18', question: `If medium is changed from air to vacuum, force:`, options: ['Increases', 'Decreases', 'Same', 'Becomes zero'], correctAnswer: 2, explanation: `Air ko reference medium maana jaata hai. Vacuum mein force same rehti hai.` },
        { id: 'q1770824593848_19', question: `Electrostatic force is a ______ force.`, options: ['Contact', 'Non-contact', 'Frictional', 'Muscular'], correctAnswer: 1, explanation: `Electrostatic force bina touch kiye act karti hai ⇒ non-contact force.` },
        { id: 'q1770824593848_20', question: `Two charges q1 and q2 exert a force F at distance r. If q1 is doubled, q2 is tripled and distance becomes 3r, the new force in terms of F is`, options: ['2F/3', '3F/2', 'F/3', '6F'], correctAnswer: 0, explanation: `q1 ×2 and q2 ×3 ⇒ force ×6, distance 3r ⇒ force ÷9, net force = 6F/9 = 2F/3` },
        { id: 'q1770824593848_21', question: `The force between two charges is F. If both charges are tripled and the distance is halved, the new force is`, options: ['9F', '12F', '18F', '36F'], correctAnswer: 3, explanation: `Charges tripled ⇒ force ×9, distance halved ⇒ force ×4, net force = 36F` },
        { id: 'q1770824593848_22', question: `Two charges of +4 μC and +6 μC are placed 0.5 m apart in air. Find the electrostatic force between them`, options: ['0.432 N', '0.864 N', '1.728 N', '0.216 N'], correctAnswer: 1, explanation: `Direct substitution in Coulomb's law gives F = 0.864 N` },
        { id: 'q1770824593848_23', question: `At what distance should two charges of 2 μC and 8 μC be placed so that the force between them is 1 N`, options: ['0.19 m', '0.28 m', '0.38 m', '0.76 m'], correctAnswer: 2, explanation: `Using r = √(kq1q2/F), distance comes ≈ 0.38 m` },
        { id: 'q1770824593848_24', question: `If the distance between two charges is increased by 100%, the force will`, options: ['become half', 'become one-fourth', 'become double', 'remain same'], correctAnswer: 1, explanation: `Distance becomes 2r, force ∝ 1/r² ⇒ force becomes 1/4` },
        { id: 'q1770824593848_25', question: `Two identical charges are placed at a distance r. If one charge is removed, the force will`, options: ['become zero', 'become half', 'become double', 'remain same'], correctAnswer: 0, explanation: `Force needs two charges, removing one makes force zero` },
        { id: 'q1770824593848_26', question: `Which of the following statements are true? (1) Coulomb force depends on medium (2) Coulomb force follows inverse square law (3) Coulomb force depends on mass of charges`, options: ['1 and 2', '2 and 3', 'only 1', 'only 2'], correctAnswer: 0, explanation: `Coulomb force depends on medium and follows inverse square law, not on mass` },
        { id: 'q1770824593848_27', question: `A charge of 5 μC is placed at a distance of 2 m. Find the electric field at that point`, options: ['1.125×10⁴ N/C', '2.25×10⁴ N/C', '4.5×10⁴ N/C', '9×10³ N/C'], correctAnswer: 0, explanation: `Using E = kQ/r², E = (9×10⁹ × 5×10⁻⁶)/(2²) = 1.125×10⁴ N/C` },
        { id: 'q1770824593848_28', question: `Electric field due to a point charge is E at distance r. What will be the field at distance 3r`, options: ['E/3', 'E/6', 'E/9', '3E'], correctAnswer: 2, explanation: `Electric field ∝ 1/r², distance becomes 3r so field becomes E/9` },
        { id: 'q1770824593848_29', question: `Electric field at a point is E. If the distance from the charge is halved, what will be the new electric field`, options: ['E/2', '2E', '4E', '8E'], correctAnswer: 2, explanation: `Distance halved ⇒ r/2, electric field becomes 4 times` },
        { id: 'q1770824593848_30', question: `Electric field at distance r from a charge is E. If the charge is made four times, find the new electric field`, options: ['E', '2E', '3E', '4E'], correctAnswer: 3, explanation: `Electric field ∝ charge, charge ×4 ⇒ field ×4` },
        { id: 'q1770824593848_31', question: `At what distance from a 2 μC charge will the electric field be 1.8×10⁴ N/C`, options: ['0.5 m', '1 m', '2 m', '3 m'], correctAnswer: 1, explanation: `r = √(kQ/E) = √((9×10⁹ × 2×10⁻⁶)/(1.8×10⁴)) = 1 m` },
        { id: 'q1770824593848_32', question: `Two equal charges +Q and +Q are placed at equal distance from a point. The electric field at that point will be`, options: ['Zero', 'E', '2E', 'Depends on medium'], correctAnswer: 0, explanation: `Equal charges produce equal fields in opposite directions, net field zero` },
        { id: 'q1770824593848_33', question: `Two charges +Q and −Q are placed symmetrically about a point. Electric field at the midpoint is`, options: ['Zero', 'Maximum', 'Depends on distance', 'Infinite'], correctAnswer: 1, explanation: `Fields due to +Q and −Q add in same direction at midpoint, hence maximum` },
        { id: 'q1770824593848_34', question: `Electric field at a point is E. If a test charge placed at that point experiences force F, what is the value of the test charge`, options: ['F/E', 'E/F', 'FE', 'F+E'], correctAnswer: 0, explanation: `By definition E = F/q ⇒ q = F/E` },
        { id: 'q1770824593848_35', question: `Which of the following is a scalar quantity?`, options: ['Electric field', 'Electric force', 'Electric potential', 'Electric field intensity'], correctAnswer: 2, explanation: `Electric potential has magnitude only, no direction, so it is a scalar quantity.` },
        { id: 'q1770824593848_36', question: `At the midpoint of an electric dipole (+Q and −Q), the electric potential is:`, options: ['Maximum', 'Minimum', 'Zero', 'Infinite'], correctAnswer: 2, explanation: `Potential due to +Q and −Q are equal and opposite, so they cancel at midpoint.` },
        { id: 'q1770824593848_37', question: `Work done in moving a charge along an equipotential surface is:`, options: ['Maximum', 'Minimum', 'Zero', 'Depends on charge'], correctAnswer: 2, explanation: `On an equipotential surface, potential difference is zero, hence work done is zero.` },
        { id: 'q1770824593848_38', question: `Electric field at a point is zero but electric potential is not zero. This situation is:`, options: ['Impossible', 'Possible', 'Always zero', 'Undefined'], correctAnswer: 1, explanation: `Example: at midpoint of dipole, electric field is zero but potential is not zero.` },
        { id: 'q1770824593848_39', question: `If electric potential at two points A and B is same, then:`, options: ['Electric field must be zero', 'No work is done in moving charge from A to B', 'Charge at A and B must be zero', 'Electric field must be same'], correctAnswer: 1, explanation: `When potential difference is zero, work done W = qΔV = 0.` },
        { id: 'q1770824593848_40', question: `A positive test charge is released in an electric field. It will move towards:`, options: ['Higher potential', 'Lower potential', 'Same potential', 'Zero field'], correctAnswer: 1, explanation: `Positive charge naturally moves from higher potential to lower potential.` },
        { id: 'q1770824593848_41', question: `Find the electric field at a point 1 m away from a charge Q = 2 μC.`, options: ['1.8 × 10⁴ N/C', '0.00018 N/C', '18 N/C', '1.8 × 10⁻⁴ N/C'], correctAnswer: 0, explanation: `Positive power of 10 means large number. 1.8 × 10⁴ = 18000, NOT 0.00018` },
        { id: 'q1770824593848_42', question: `Two charges +3 μC and +6 μC are 1 m apart. Find force on +3 μC.`, options: ['0.0162 N', '1.62 N', '0.162 N', '162 N'], correctAnswer: 2, explanation: `Using Coulomb's law F = kq₁q₂/r² gives 0.162 N.` },
        { id: 'q1770824593848_43', question: `Electric potential at distance r is 20 V. Find potential at distance 4r.`, options: ['80 V', '40 V', '10 V', '5 V'], correctAnswer: 3, explanation: `Electric potential V ∝ 1/r, so at 4r potential becomes 1/4 ⇒ 5 V` },
        { id: 'q1770824593848_44', question: `Two equal charges +4 μC are placed 2 m apart. Find electric field at midpoint.`, options: ['9 × 10⁴ N/C', 'Zero', '4.5 × 10⁴ N/C', 'Cannot be zero'], correctAnswer: 1, explanation: `Fields due to equal charges at midpoint are equal and opposite, so they cancel` },
        { id: 'q1770824593848_45', question: `Two charges +5 μC and −5 μC are 2 m apart. Find electric potential at midpoint.`, options: ['4.5 × 10⁴ V', '−4.5 × 10⁴ V', 'Zero', 'Cannot be zero'], correctAnswer: 2, explanation: `Potential is scalar: +V + (−V) = 0. Dipole midpoint potential is zero` },
        { id: 'q1770824593848_46', question: `Three charges +1 μC, +2 μC, +1 μC are placed in a straight line with 1 m distance between each. Find net force on middle charge.`, options: ['3.6 × 10⁻⁴ N', '−3.6 × 10⁻⁴ N', 'Zero', 'Cannot be determined'], correctAnswer: 2, explanation: `Forces due to left and right charges are equal and opposite, so net force is zero (symmetry)` },
        { id: 'q1770824593848_47', question: `An electric dipole has charges ±2 μC separated by 4 cm. Find dipole moment.`, options: ['8 × 10⁻⁶ C·m', '0.08 × 10⁻⁶ C·m', '8 × 10⁻⁸ C·m', '0.8 × 10⁻⁶ C·m'], correctAnswer: 2, explanation: `Dipole moment p = q × separation = 2×10⁻⁶ × 0.04 = 8×10⁻⁸ C·m` },
        { id: 'q1770824593848_48', question: `Electric field at midpoint of a dipole is E. If separation is doubled, new field is:`, options: ['2E', 'E', 'E/2', 'E/4'], correctAnswer: 2, explanation: `Dipole midpoint field is inversely proportional to separation. Double separation ⇒ E/2` },
        { id: 'q1770824593848_49', question: `Is it possible that electric field is zero but electric potential is not zero?`, options: ['Yes, inside a charged conductor', 'No, never possible', 'Only in vacuum', 'Only for dipoles'], correctAnswer: 0, explanation: `Inside a charged conductor, electric field is zero but potential is constant (not zero)` }
      ]
    }
  ]
};

export const cuetPhysicsSubject: Subject = {
  id: 'physics',
  name: 'Physics',
  tests: [],
  chapters: [electrostaticsChapter]
};
