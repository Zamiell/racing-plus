const CARD_MAP = new Map([
  ["fool", 1],
  ["magician", 2],
  ["magi", 2],
  ["mag", 2],
  ["high priestess", 3],
  ["highpriestess", 3], // cspell:disable-line
  ["high", 3],
  ["priestess", 3],
  ["priest", 3],
  ["hp", 3],
  ["empress", 4],
  ["emperor", 5],
  ["emp", 5],
  ["hierophant", 6],
  ["hiero", 6], // cspell:disable-line
  ["lovers", 7],
  ["chariot", 8],
  ["justice", 9],
  ["hermit", 10],
  ["wheel of fortune", 11],
  ["wheeloffortune", 11], // cspell:disable-line
  ["wheel", 11],
  ["fortune", 11],
  ["strength", 12],
  ["str", 12],
  ["hanged man", 13],
  ["hangedman", 13], // cspell:disable-line
  ["hanged", 13],
  ["death", 14],
  ["temperance", 15],
  ["devil", 16],
  ["tower", 17],
  ["stars", 18],
  ["moon", 19],
  ["sun", 20],
  ["judgement", 21],
  ["judge", 21],
  ["world", 22],
  ["2 of clubs", 23],
  ["2ofclubs", 23], // cspell:disable-line
  ["2clubs", 23],
  ["2 of diamonds", 24],
  ["2ofdiamonds", 24], // cspell:disable-line
  ["2diamonds", 24],
  ["2 of spades", 25],
  ["2ofspades", 25], // cspell:disable-line
  ["2spades", 25],
  ["2 of hearts", 26],
  ["2ofhearts", 26], // cspell:disable-line
  ["2hearts", 26],
  ["ace of clubs", 27],
  ["aceofclubs", 27], // cspell:disable-line
  ["aceclubs", 27], // cspell:disable-line
  ["ace of diamonds", 28],
  ["aceofdiamonds", 28], // cspell:disable-line
  ["acediamonds", 28], // cspell:disable-line
  ["ace of spades", 29],
  ["aceofspades", 29], // cspell:disable-line
  ["acespades", 29], // cspell:disable-line
  ["ace of hearts", 30],
  ["aceofhearts", 30], // cspell:disable-line
  ["acehearts", 30], // cspell:disable-line
  ["joker", 31],
  ["hagalaz", 32],
  ["destruction", 32],
  ["jera", 33],
  ["abundance", 33],
  ["ehwaz", 34],
  ["passage", 34],
  ["dagaz", 35],
  ["purity", 35],
  ["ansuz", 36],
  ["vision", 36],
  ["perthro", 37],
  ["change", 37],
  ["berkano", 38],
  ["companionship", 38],
  ["algiz", 39],
  ["resistance", 39],
  ["shield", 39],
  ["blank", 40],
  ["black", 41],
  ["chaos", 42],
  ["credit", 43],
  ["rules", 44],
  ["against humanity", 45],
  ["againsthumanity", 45], // cspell:disable-line
  ["humanity", 45],
  ["suicide king", 46],
  ["suicideking", 46], // cspell:disable-line
  ["suicide", 46],
  ["get out of jail free", 47],
  ["getoutofjailfree", 47], // cspell:disable-line
  ["get out of jail", 47],
  ["getoutofjail", 47], // cspell:disable-line
  ["get out", 47],
  ["getout", 47], // cspell:disable-line
  ["jail", 47],
  ["?", 48],
  ["dice shard", 49],
  ["diceshard", 49], // cspell:disable-line
  ["dice", 49],
  ["shard", 49],
  ["emergency contact", 50],
  ["emergencycontact", 50], // cspell:disable-line
  ["emergency", 50],
  ["contact", 50],
  ["holy", 51],
  ["huge growth", 52],
  ["hugegrowth", 52], // cspell:disable-line
  ["growth", 52],
  ["ancient recall", 53],
  ["ancientrecall", 53], // cspell:disable-line
  ["ancient", 53],
  ["recall", 53],
  ["era walk", 54],
  ["erawalk", 54], // cspell:disable-line
  ["era", 54],
  ["walk", 54],
  ["rune shard", 55],
  ["runeshard", 55], // cspell:disable-line
  ["shard", 55],
  ["fool?", 56],
  ["fool2", 56],
  ["magician?", 57],
  ["magician2", 57],
  ["magi?", 57],
  ["magi2", 57],
  ["mag?", 57],
  ["mag2", 57],
  ["high priestess?", 58],
  ["high priestess2", 58],
  ["highpriestess?", 58], // cspell:disable-line
  ["highpriestess2", 58], // cspell:disable-line
  ["high?", 58],
  ["high2", 58],
  ["priestess?", 58],
  ["priestess2", 58],
  ["priest?", 58],
  ["priest2", 58],
  ["hp?", 58],
  ["hp2", 58],
  ["empress?", 59],
  ["empress2", 59],
  ["emperor?", 60],
  ["emperor2", 60],
  ["emp?", 60],
  ["emp2", 60],
  ["hierophant?", 61],
  ["hierophant2", 61],
  ["hiero?", 61], // cspell:disable-line
  ["hiero2", 61], // cspell:disable-line
  ["lovers?", 62],
  ["lovers2", 62],
  ["chariot?", 63],
  ["chariot2", 63],
  ["justice?", 64],
  ["justice2", 64],
  ["hermit?", 65],
  ["hermit2", 65],
  ["wheel of fortune?", 66],
  ["wheel of fortune2", 66],
  ["wheeloffortune?", 66], // cspell:disable-line
  ["wheeloffortune2", 66], // cspell:disable-line
  ["wheel?", 66],
  ["wheel2", 66],
  ["fortune?", 66],
  ["fortune2", 66],
  ["strength?", 67],
  ["strength2", 67],
  ["str?", 67],
  ["str2", 67],
  ["hanged man?", 68],
  ["hanged man2", 68],
  ["hangedman?", 68], // cspell:disable-line
  ["hangedman2", 68], // cspell:disable-line
  ["hanged?", 68],
  ["hanged2", 68],
  ["death?", 69],
  ["death2", 69],
  ["temperance?", 70],
  ["temperance2", 70],
  ["devil?", 71],
  ["devil2", 71],
  ["tower?", 72],
  ["tower2", 72],
  ["stars?", 73],
  ["stars2", 73],
  ["moon?", 74],
  ["moon2", 74],
  ["sun?", 75],
  ["sun2", 75],
  ["judgement?", 76],
  ["judgement2", 76],
  ["judge?", 76],
  ["judge2", 76],
  ["world?", 77],
  ["world2", 77],
  ["cracked key", 78],
  ["crackedkey", 78], // cspell:disable-line
  ["cracked", 78],
  ["key", 78],
  ["queen of hearts", 79],
  ["queenofhearts", 79], // cspell:disable-line
  ["queen hearts", 79],
  ["queenhearts", 79], // cspell:disable-line
  ["queen", 79],
  ["wild card", 80],
  ["wildcard", 80],
  ["wild", 80],
  ["soul of isaac", 81],
  ["soulofisaac", 81], // cspell:disable-line
  ["soulisaac", 81], // cspell:disable-line
  ["isaac", 81],
  ["soul of magdalene", 82],
  ["soulofmagdalene", 82], // cspell:disable-line
  ["soulmagdalene", 82], // cspell:disable-line
  ["magdalene", 82],
  ["soul of cain", 83],
  ["soulofcain", 83], // cspell:disable-line
  ["soulcain", 83], // cspell:disable-line
  ["cain", 83],
  ["soul of judas", 84],
  ["soulofjudas", 84], // cspell:disable-line
  ["souljudas", 84], // cspell:disable-line
  ["judas", 84],
  ["soul of ???", 85],
  ["soulof???", 85], // cspell:disable-line
  ["soul???", 85],
  ["???", 85],
  ["soul of blue baby", 85],
  ["soulofbluebaby", 85], // cspell:disable-line
  ["soulbluebaby", 85], // cspell:disable-line
  ["blue baby", 85],
  ["bluebaby", 85], // cspell:disable-line
  ["soul of eve", 86],
  ["soulofeve", 86], // cspell:disable-line
  ["souleve", 86], // cspell:disable-line
  ["eve", 86],
  ["soul of samson", 87],
  ["soulofsamson", 87], // cspell:disable-line
  ["soulsamson", 87], // cspell:disable-line
  ["samson", 87],
  ["soul of azazel", 88],
  ["soulofazazel", 88], // cspell:disable-line
  ["soulazazel", 88], // cspell:disable-line
  ["azazel", 88],
  ["soul of lazarus", 89],
  ["souloflazarus", 89], // cspell:disable-line
  ["soullazarus", 89], // cspell:disable-line
  ["lazarus", 89],
  ["soul of eden", 90],
  ["soulofeden", 90], // cspell:disable-line
  ["souleden", 90], // cspell:disable-line
  ["eden", 90],
  ["soul of the lost", 91],
  ["soulofthelost", 91], // cspell:disable-line
  ["souloflost", 91], // cspell:disable-line
  ["soullost", 91], // cspell:disable-line
  ["the lost", 91],
  ["thelost", 91],
  ["lost", 91],
  ["soul of lilith", 92],
  ["souloflilith", 92], // cspell:disable-line
  ["soullilith", 92], // cspell:disable-line
  ["lilith", 92],
  ["soul of the keeper", 93],
  ["soulofthekeeper", 93], // cspell:disable-line
  ["soulofkeeper", 93], // cspell:disable-line
  ["soulkeeper", 93], // cspell:disable-line
  ["keeper", 93],
  ["soul of apollyon", 94],
  ["soulofapollyon", 94], // cspell:disable-line
  ["soulapollyon", 94], // cspell:disable-line
  ["apollyon", 94],
  ["soul of the forgotten", 95],
  ["souloftheforgotten", 95], // cspell:disable-line
  ["soulofforgotten", 95], // cspell:disable-line
  ["soulforgotten", 95], // cspell:disable-line
  ["forgotten", 95],
  ["soul of bethany", 96],
  ["soulofbethany", 96], // cspell:disable-line
  ["soulbethany", 96], // cspell:disable-line
  ["bethany", 96],
  ["soul of jacob and esau", 97],
  ["soul of jacob & esau", 97],
  ["soul of jacob", 97],
  ["soulofjacobandesau", 97], // cspell:disable-line
  ["soulofjacob&esau", 97], // cspell:disable-line
  ["soulofjacob", 97], // cspell:disable-line
  ["souljacobandesau", 97], // cspell:disable-line
  ["souljacob&esau", 97], // cspell:disable-line
  ["souljacob", 97], // cspell:disable-line
  ["jacobandesau", 97], // cspell:disable-line
  ["jacob&esau", 97],
  ["jacob", 97],
]);
export default CARD_MAP;
