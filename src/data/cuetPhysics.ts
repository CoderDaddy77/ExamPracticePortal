import type { Subject } from '../types';

export const cuetPhysicsSubject: Subject = {
  id: 'physics',
  name: 'Physics',
  tests: [
    {
      id: 'phy-ch1-easy',
      name: 'Chapter 1 - Electric Charges and Fields (Easy)',
      questions: [
        {
          id: 'cuet-phy-ch1-q1',
          question: 'Electric charge is measured in',
          options: ['volt', 'ampere', 'coulomb', 'newton'],
          correctAnswer: 2,
          explanation: 'Charge is measured in coulomb.'
        },
        {
          id: 'cuet-phy-ch1-q2',
          question: 'Like charges',
          options: ['attract', 'repel', 'neutralize', 'stop moving'],
          correctAnswer: 1,
          explanation: 'Like charges repel due to same sign.'
        },
        {
          id: 'cuet-phy-ch1-q3',
          question: 'The SI unit of electric field is',
          options: ['N/C', 'C/N', 'J/C', 'C·m'],
          correctAnswer: 0,
          explanation: 'Electric field = N/C.'
        },
        {
          id: 'cuet-phy-ch1-q4',
          question: 'A positively charged body has',
          options: ['excess electrons', 'deficit of electrons', 'protons removed', 'extra neutrons'],
          correctAnswer: 1,
          explanation: 'Positive charge = electron deficiency.'
        },
        {
          id: 'cuet-phy-ch1-q5',
          question: 'Charging by rubbing is called',
          options: ['conduction', 'induction', 'frictional electrification', 'polarization'],
          correctAnswer: 2,
          explanation: 'Rubbing transfers electrons (friction).'
        },
        {
          id: 'cuet-phy-ch1-q6',
          question: 'The force between two charges in vacuum is given by',
          options: ['Ohm\'s law', 'Gauss law', 'Coulomb\'s law', 'Faraday law'],
          correctAnswer: 2,
          explanation: 'Coulomb\'s law defines force between charges.'
        },
        {
          id: 'cuet-phy-ch1-q7',
          question: 'Electrostatic force varies as',
          options: ['1/r', 'r', '1/r²', 'r²'],
          correctAnswer: 2,
          explanation: 'Force ∝ 1/r².'
        },
        {
          id: 'cuet-phy-ch1-q8',
          question: 'Coulomb constant k equals',
          options: ['9×10⁹ Nm²/C²', '9×10⁶ Nm²/C²', '10³ Nm²/C²', '1 Nm²/C²'],
          correctAnswer: 0,
          explanation: 'Standard value of Coulomb constant.'
        },
        {
          id: 'cuet-phy-ch1-q9',
          question: 'Electric lines of force originate from',
          options: ['negative charge', 'neutral body', 'positive charge', 'both'],
          correctAnswer: 2,
          explanation: 'Electric lines start from + charge.'
        },
        {
          id: 'cuet-phy-ch1-q10',
          question: 'Electric lines of force terminate on',
          options: ['positive', 'both', 'negative', 'none'],
          correctAnswer: 2,
          explanation: 'Terminate on − charge.'
        },
        {
          id: 'cuet-phy-ch1-q11',
          question: 'Electric flux is measured in',
          options: ['Nm²/C', 'C', 'N/C', 'J'],
          correctAnswer: 0,
          explanation: 'Φ is measured in Nm²/C.'
        },
        {
          id: 'cuet-phy-ch1-q12',
          question: 'Two charges +q and −q form a',
          options: ['conductor', 'insulator', 'dipole', 'capacitor'],
          correctAnswer: 2,
          explanation: 'A pair of +q, −q is dipole.'
        },
        {
          id: 'cuet-phy-ch1-q13',
          question: 'Dipole moment p equals',
          options: ['q/d', 'd/q', 'q×d', 'q+d'],
          correctAnswer: 2,
          explanation: 'p = qd.'
        },
        {
          id: 'cuet-phy-ch1-q14',
          question: 'The SI unit of dipole moment is',
          options: ['C', 'C·m', 'Nm', 'C/m'],
          correctAnswer: 1,
          explanation: 'Dipole moment unit is coulomb-meter.'
        },
        {
          id: 'cuet-phy-ch1-q15',
          question: 'Electric field inside a conductor is',
          options: ['zero', 'infinite', 'maximum', 'varies'],
          correctAnswer: 0,
          explanation: 'Field inside conductor = 0 (electrostatic equilibrium).'
        },
        {
          id: 'cuet-phy-ch1-q16',
          question: 'SI unit of permittivity ε₀ is',
          options: ['C²/N·m²', 'N/C', 'C/m²', 'J/C'],
          correctAnswer: 0,
          explanation: 'ε₀ has unit C²/N·m².'
        },
        {
          id: 'cuet-phy-ch1-q17',
          question: 'When distance between two charges doubles, the force becomes',
          options: ['4 times', 'half', '1/4th', 'double'],
          correctAnswer: 2,
          explanation: 'Force becomes 1/4th.'
        },
        {
          id: 'cuet-phy-ch1-q18',
          question: 'Charge on an electron is',
          options: ['+e', '−e', '0', '2e'],
          correctAnswer: 1,
          explanation: 'Electron has charge −1.6×10⁻¹⁹ C.'
        },
        {
          id: 'cuet-phy-ch1-q19',
          question: 'Electric flux through a closed surface depends on',
          options: ['charge enclosed', 'area only', 'medium only', 'temperature'],
          correctAnswer: 0,
          explanation: 'Flux depends only on charge enclosed.'
        },
        {
          id: 'cuet-phy-ch1-q20',
          question: 'In a uniform electric field, field lines are',
          options: ['curved', 'straight', 'circular', 'random'],
          correctAnswer: 1,
          explanation: 'Uniform field = parallel straight lines.'
        },
        {
          id: 'cuet-phy-ch1-q21',
          question: 'Gauss law relates electric flux with',
          options: ['mass', 'time', 'enclosed charge', 'force'],
          correctAnswer: 2,
          explanation: 'Gauss law: Φ = q/ε₀.'
        },
        {
          id: 'cuet-phy-ch1-q22',
          question: 'A conductor allows',
          options: ['free movement of charges', 'no charge movement', 'only electrons fixed', 'only protons move'],
          correctAnswer: 0,
          explanation: 'Conductors allow free movement of electrons.'
        },
        {
          id: 'cuet-phy-ch1-q23',
          question: 'An insulator has',
          options: ['free electrons', 'bound electrons', 'mobile protons', 'no atoms'],
          correctAnswer: 1,
          explanation: 'Insulators have bound electrons.'
        },
        {
          id: 'cuet-phy-ch1-q24',
          question: 'Frictional electricity is generated due to',
          options: ['rubbing', 'heating', 'cooling', 'bending'],
          correctAnswer: 0,
          explanation: 'Rubbing → charge transfer.'
        },
        {
          id: 'cuet-phy-ch1-q25',
          question: 'The SI unit of electric flux density is',
          options: ['N/C', 'C/m²', 'N·m²/C', 'J/m'],
          correctAnswer: 1,
          explanation: 'σ = charge/area.'
        },
        {
          id: 'cuet-phy-ch1-q26',
          question: 'If charge q on a source increases, the electric field',
          options: ['decreases', 'increases', 'becomes zero', 'fluctuates'],
          correctAnswer: 1,
          explanation: 'E ∝ q.'
        },
        {
          id: 'cuet-phy-ch1-q27',
          question: 'The inverse square law applies to',
          options: ['light', 'pressure', 'Coulomb force', 'current'],
          correctAnswer: 2,
          explanation: 'Coulomb force ∝ 1/r².'
        },
        {
          id: 'cuet-phy-ch1-q28',
          question: 'Charges +Q and −Q placed close together form a',
          options: ['conductor', 'dipole', 'magnet', 'capacitor'],
          correctAnswer: 1,
          explanation: 'Opposite charges near each other → dipole.'
        },
        {
          id: 'cuet-phy-ch1-q29',
          question: 'Direction of electric field is taken from',
          options: ['+ to −', '− to +', 'north to south', 'anywhere'],
          correctAnswer: 0,
          explanation: 'From positive to negative.'
        },
        {
          id: 'cuet-phy-ch1-q30',
          question: 'Electric field inside a cavity of a conductor is',
          options: ['zero', 'increases', 'decreases', 'unpredictable'],
          correctAnswer: 0,
          explanation: 'Zero due to shielding.'
        },
        {
          id: 'cuet-phy-ch1-q31',
          question: 'Electric flux through a closed surface depends on',
          options: ['shape', 'volume', 'net charge enclosed', 'size'],
          correctAnswer: 2,
          explanation: 'Only depends on enclosed charge.'
        },
        {
          id: 'cuet-phy-ch1-q32',
          question: 'Superposition principle applies to',
          options: ['forces only', 'charges only', 'electric field', 'field & force'],
          correctAnswer: 2,
          explanation: 'Fields add vectorially.'
        },
        {
          id: 'cuet-phy-ch1-q33',
          question: 'Two negative charges',
          options: ['attract', 'repel', 'no force', 'follow magnetism'],
          correctAnswer: 1,
          explanation: 'Similar charges repel.'
        },
        {
          id: 'cuet-phy-ch1-q34',
          question: 'Electric dipole moment is a vector drawn from',
          options: ['+ to −', 'center to +', '− to +', 'neutral to charge'],
          correctAnswer: 2,
          explanation: 'Dipole vector is − to +.'
        },
        {
          id: 'cuet-phy-ch1-q35',
          question: 'A Gauss surface must be',
          options: ['conducting', 'imaginary', 'solid metal', 'of fixed shape'],
          correctAnswer: 1,
          explanation: 'Gauss surface is imaginary.'
        },
        {
          id: 'cuet-phy-ch1-q36',
          question: 'Electric field is defined as',
          options: ['F/q', 'q/F', 'qd', 'd/q'],
          correctAnswer: 0,
          explanation: 'E = F/q.'
        },
        {
          id: 'cuet-phy-ch1-q37',
          question: 'The SI unit of Coulomb constant k is',
          options: ['N·m²/C²', 'C²/N·m²', 'N/C²', 'N/m'],
          correctAnswer: 0,
          explanation: 'k has unit Nm²/C².'
        },
        {
          id: 'cuet-phy-ch1-q38',
          question: 'Electric charge is a',
          options: ['scalar', 'vector', 'none', 'tensor'],
          correctAnswer: 0,
          explanation: 'Charge has magnitude only.'
        },
        {
          id: 'cuet-phy-ch1-q39',
          question: '1 microcoulomb (1 μC) equals',
          options: ['10⁻³ C', '10⁻⁶ C', '10⁶ C', '1 C'],
          correctAnswer: 1,
          explanation: '1 μC = 10⁻⁶ C.'
        },
        {
          id: 'cuet-phy-ch1-q40',
          question: 'A conducting sphere distributes charge',
          options: ['unequally', 'equally on surface', 'at center', 'inside only'],
          correctAnswer: 1,
          explanation: 'Charge distributes uniformly on surface.'
        },
        {
          id: 'cuet-phy-ch1-q41',
          question: 'Electric field due to a point charge is',
          options: ['uniform', 'non-uniform', 'zero', 'random'],
          correctAnswer: 1,
          explanation: 'Point charge field varies with distance.'
        },
        {
          id: 'cuet-phy-ch1-q42',
          question: 'The direction of test charge movement is in the direction of',
          options: ['lower potential', 'higher potential', 'electric field', 'insulation'],
          correctAnswer: 2,
          explanation: 'Test charge moves along electric field.'
        },
        {
          id: 'cuet-phy-ch1-q43',
          question: 'The work done to bring a charge in an electrostatic field is stored as',
          options: ['potential', 'energy', 'force', 'constant'],
          correctAnswer: 1,
          explanation: 'Work stores potential energy.'
        },
        {
          id: 'cuet-phy-ch1-q44',
          question: 'Electrostatic shielding works in a',
          options: ['conductor', 'insulator', 'vacuum', 'glass'],
          correctAnswer: 0,
          explanation: 'Conductors block electric field.'
        },
        {
          id: 'cuet-phy-ch1-q45',
          question: 'Force between charges in a medium compared to vacuum is',
          options: ['Fvacuum', 'Fvac/εr', 'Fvac × εr', 'F + εr'],
          correctAnswer: 1,
          explanation: 'In medium F reduces by dielectric constant.'
        },
        {
          id: 'cuet-phy-ch1-q46',
          question: 'Dielectric constant K is defined as',
          options: ['ε₀/ε', 'ε/ε₀', 'q/ε₀', 'F/E'],
          correctAnswer: 1,
          explanation: 'K = ε/ε₀.'
        },
        {
          id: 'cuet-phy-ch1-q47',
          question: 'Net electric flux through a closed surface with no charge inside is',
          options: ['minimum', 'maximum', 'zero', 'infinite'],
          correctAnswer: 2,
          explanation: 'No charge enclosed → zero flux.'
        },
        {
          id: 'cuet-phy-ch1-q48',
          question: 'The SI unit of surface charge density σ is',
          options: ['C/m', 'C/m²', 'C/m³', 'C²'],
          correctAnswer: 1,
          explanation: 'Surface charge density is C/m².'
        },
        {
          id: 'cuet-phy-ch1-q49',
          question: 'The property that charge cannot be divided infinitely is called',
          options: ['quantized', 'discrete', 'conserved', 'neutral'],
          correctAnswer: 0,
          explanation: 'Charge exists in multiples of e.'
        },
        {
          id: 'cuet-phy-ch1-q50',
          question: 'A conductor in electrostatic equilibrium has charge',
          options: ['only at surface', 'inside only', 'both', 'nowhere'],
          correctAnswer: 0,
          explanation: 'All excess charge resides on surface.'
        }
      ]
    }
  ]
};
