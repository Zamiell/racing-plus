const CHARACTER_MAP = new Map<string, PlayerType>([
  ["isaac", 0],
  ["magdalene", 1],
  ["maggy", 1], // cspell:disable-line
  ["cain", 2],
  ["judas", 3],
  ["blue baby", 4],
  ["bluebaby", 4], // cspell:disable-line
  ["bb", 4],
  ["eve", 5],
  ["samson", 6],
  ["azazel", 7],
  ["lazarus", 8],
  ["laz", 8],
  ["eden", 9],
  ["the lost", 10],
  ["thelost", 10],
  ["lost", 10],
  ["lazarus2", 11],
  ["laz2", 11],
  ["dark judas", 12],
  ["darkjudas", 12], // cspell:disable-line
  ["djudas", 12], // cspell:disable-line
  ["dj", 12],
  ["black judas", 12],
  ["blackjudas", 12], // cspell:disable-line
  ["bjudas", 12], // cspell:disable-line
  ["bj", 12],
  ["lilith", 13],
  ["keeper", 14],
  ["apollyon", 15],
  ["the forgotten", 16],
  ["theforgotten", 16],
  ["forgotten", 16],
  ["the soul", 17],
  ["thesoul", 17],
  ["soul", 17],
  ["bethany", 18],
  ["jacob", 19],
  ["esau", 20],
  ["isaac2", 21],
  ["tisaac", 21], // cspell:disable-line
  ["taintedisaac", 21], // cspell:disable-line
  ["magdalene2", 22],
  ["maggy2", 22], // cspell:disable-line
  ["tmagdalene", 22], // cspell:disable-line
  ["tmaggy", 22], // cspell:disable-line
  ["taintedmagdalene", 22], // cspell:disable-line
  ["taintedmaggy", 22], // cspell:disable-line
  ["cain2", 23],
  ["tcain", 23], // cspell:disable-line
  ["taintedcain", 23], // cspell:disable-line
  ["judas2", 24],
  ["tjudas", 24], // cspell:disable-line
  ["taintedjudas", 24], // cspell:disable-line
  ["bluebaby2", 25], // cspell:disable-line
  ["tbluebaby", 25], // cspell:disable-line
  ["taintedbluebaby", 25], // cspell:disable-line
  ["bb2", 25],
  ["tbb", 25],
  ["taintedbb", 25], // cspell:disable-line
  ["eve2", 26],
  ["teve", 26], // cspell:disable-line
  ["taintedeve", 26], // cspell:disable-line
  ["samson2", 27],
  ["tsamson", 27], // cspell:disable-line
  ["taintedsamson", 27], // cspell:disable-line
  ["azazel2", 28],
  ["tazazel", 28], // cspell:disable-line
  ["taintedazazel", 28], // cspell:disable-line
  ["tlaz", 29], // cspell:disable-line
  ["tlazarus", 29], // cspell:disable-line
  ["taintedlaz", 29], // cspell:disable-line
  ["taintedlazarus", 29], // cspell:disable-line
  ["eden2", 30],
  ["teden", 30], // cspell:disable-line
  ["taintededen", 30], // cspell:disable-line
  ["lost2", 31],
  ["tlost", 31], // cspell:disable-line
  ["taintedlost", 31], // cspell:disable-line
  ["lilith2", 32],
  ["tlilith", 32], // cspell:disable-line
  ["taintedlilith", 32], // cspell:disable-line
  ["keeper2", 33],
  ["tkeeper", 33], // cspell:disable-line
  ["taintedkeeper", 33], // cspell:disable-line
  ["apollyon2", 34],
  ["tapollyon", 34], // cspell:disable-line
  ["taintedapollyon", 34], // cspell:disable-line
  ["forgotten2", 35],
  ["tforgotten", 35], // cspell:disable-line
  ["taintedforgotten", 35], // cspell:disable-line
  ["bethany2", 36],
  ["tbethany", 36], // cspell:disable-line
  ["taintedbethany", 36], // cspell:disable-line
  ["jacob2", 37],
  ["tjacob", 37], // cspell:disable-line
  ["taintedjacob", 37], // cspell:disable-line
  ["tlazdead", 38], // cspell:disable-line
  ["tlazarusdead", 38], // cspell:disable-line
  ["taintedlazdead", 38], // cspell:disable-line
  ["taintedlazarusdead", 38], // cspell:disable-line
  ["deadtlaz", 38], // cspell:disable-line
  ["deadtlazarus", 38], // cspell:disable-line
  ["deadtaintedlaz", 38], // cspell:disable-line
  ["deadtaintedlazarus", 38], // cspell:disable-line
  ["jacob2ghost", 39],
  ["tjacobghost", 39], // cspell:disable-line
  ["taintedjacobghost", 39], // cspell:disable-line
  ["ghostjacob2", 39], // cspell:disable-line
  ["ghosttjacob", 39], // cspell:disable-line
  ["ghosttaintedjacob", 39], // cspell:disable-line
  // 40 is Tainted Soul, which is the same as Tainted Forgotten
  ["baby", 41],
  ["randombaby", 41], // cspell:disable-line
]);
export default CHARACTER_MAP;
