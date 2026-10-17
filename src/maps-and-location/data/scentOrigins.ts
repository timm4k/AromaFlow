import type { ScentOrigin } from "../types/map";

function kewSource(taxonId: string) {
  return {
    sourceName: "Kew Plants of the World Online",
    sourceUrl: `https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:${taxonId}`,
  };
}

export const scentOrigins: ScentOrigin[] = [
  {
    scentId: "1",
    species: "Rosa × damascena",
    region: "Rural Damascus, Syria",
    rangeNote:
      "Cultivated Damask rose; UNESCO recognises traditional rose-oil making in Al-Mrah, not a wild native origin",
    coordinate: { latitude: 33.8, longitude: 36.7 },
    sourceName: "UNESCO Intangible Cultural Heritage",
    sourceUrl:
      "https://ich.unesco.org/en/RL/practices-and-craftsmanship-associated-with-the-damascene-rose-in-al-mrah-01369",
  },
  {
    scentId: "5",
    species: "Citrus × limon",
    region: "Syracuse, Sicily, Italy",
    rangeNote:
      "Lemon-growing region producing fragrant peel oil; a cultivation reference, not a wild native origin",
    coordinate: { latitude: 37.1, longitude: 15.2 },
    sourceName: "PASAM Agrumi — Syracuse lemon growers",
    sourceUrl: "https://www.pasamagrumi.it/en/limone-di-siracusa-igp/",
  },
  {
    scentId: "6",
    species: "Jasminum officinale",
    region: "Nepal, Himalayas",
    rangeNote:
      "Common jasmine is native from the Caucasus to south-central China; one representative jasmine species",
    coordinate: { latitude: 28, longitude: 84 },
    ...kewSource("609672-1"),
  },
  {
    scentId: "7",
    species: "Santalum album",
    region: "Timor, Indonesia",
    rangeNote:
      "Kew lists the native range from Java to northern Australia; sandalwood is also cultivated in India",
    coordinate: { latitude: -9.8, longitude: 124.2 },
    ...kewSource("780592-1"),
  },
  {
    scentId: "8",
    species: "Mentha × piperita",
    region: "Central Europe, Germany",
    rangeNote:
      "Hybrid of water mint and spearmint, with a native range across Europe to Central Asia",
    coordinate: { latitude: 51, longitude: 10 },
    ...kewSource("450969-1"),
  },
  {
    scentId: "9",
    species: "Citrus × sinensis",
    region: "Southern China",
    rangeNote:
      "Sweet orange is a cultivated citrus hybrid associated with southern China, not a wild species originating in Brazil",
    coordinate: { latitude: 23.5, longitude: 110 },
    ...kewSource("3287406-4"),
  },
  {
    scentId: "10",
    species: "Cedrus atlantica",
    region: "Atlas Mountains, Morocco",
    rangeNote:
      "Atlas cedar is native to Morocco and Algeria; one botanical source represented by cedarwood fragrances",
    coordinate: { latitude: 33.4, longitude: -5.1 },
    ...kewSource("50881822-1"),
  },
  {
    scentId: "11",
    species: "Citrus bergamia",
    region: "Calabria, Italy",
    rangeNote:
      "Bergamot is a citrus hybrid grown in Calabria for its aromatic rind oil; a cultivation reference",
    coordinate: { latitude: 37.9, longitude: 15.9 },
    sourceName:
      "University of California, Riverside — Citrus Variety Collection",
    sourceUrl: "https://citrusvariety.ucr.edu/crc2881",
  },
  {
    scentId: "12",
    species: "Cananga odorata",
    region: "Java, Indonesia",
    rangeNote:
      "Native from southern Indo-China to Queensland; Comoros and Madagascar are cultivation regions",
    coordinate: { latitude: -7.5, longitude: 110.5 },
    ...kewSource("72580-1"),
  },
  {
    scentId: "13",
    species: "Pogostemon cablin",
    region: "Sumatra, Indonesia",
    rangeNote:
      "Native to Sri Lanka, western and central Malesia, and Papua New Guinea",
    coordinate: { latitude: -0.5, longitude: 101.5 },
    ...kewSource("454827-1"),
  },
  {
    scentId: "14",
    species: "Eucalyptus globulus",
    region: "Eastern Tasmania, Australia",
    rangeNote:
      "Tasmanian blue gum is native to southern Victoria and eastern Tasmania, and is a source of eucalyptus oil",
    coordinate: { latitude: -42, longitude: 148 },
    ...kewSource("592965-1"),
  },
  {
    scentId: "15",
    species: "Citrus × paradisi",
    region: "Barbados, Caribbean",
    rangeNote:
      "Grapefruit is generally considered to have arisen in Barbados as a hybrid involving pomelo and sweet orange",
    coordinate: { latitude: 13.2, longitude: -59.5 },
    sourceName: "University of California, Riverside — Tropical Fruits",
    sourceUrl: "https://faculty.ucr.edu/~legneref/botany/trofruit.htm",
  },
  {
    scentId: "16",
    species: "Boswellia sacra",
    region: "Dhofar, Oman",
    rangeNote:
      "This frankincense tree is native to northern Somalia, southern Yemen and south-western Oman",
    coordinate: { latitude: 17.2, longitude: 54 },
    ...kewSource("127065-1"),
  },
  {
    scentId: "17",
    species: "Pelargonium graveolens",
    region: "Eastern Cape, South Africa",
    rangeNote:
      "Rose-scented geranium is native from eastern Zimbabwe to the Eastern Cape; cultivated fragrance varieties may be hybrids",
    coordinate: { latitude: -32.5, longitude: 27 },
    ...kewSource("376259-1"),
  },
  {
    scentId: "18",
    species: "Piper nigrum",
    region: "South-western Sri Lanka",
    rangeNote:
      "Kew currently lists Sri Lanka as the native range; black pepper is also widely cultivated in India and Vietnam",
    coordinate: { latitude: 6.5, longitude: 80.5 },
    ...kewSource("682369-1"),
  },
  {
    scentId: "19",
    species: "Matricaria chamomilla",
    region: "Central Europe, Austria",
    rangeNote:
      "German chamomile is native across Macaronesia, North Africa and temperate Eurasia to Indo-China",
    coordinate: { latitude: 48, longitude: 15 },
    ...kewSource("154715-2"),
  },
  {
    scentId: "20",
    species: "Commiphora myrrha",
    region: "Somalia, Horn of Africa",
    rangeNote:
      "Myrrh grows naturally in north-eastern Africa and parts of the southern Arabian Peninsula",
    coordinate: { latitude: 9.5, longitude: 48 },
    ...kewSource("127741-1"),
  },
  {
    scentId: "22",
    species: "Citrus × aurantium — bitter orange flowers",
    region: "Nabeul, Tunisia",
    rangeNote:
      "Neroli is distilled from bitter orange flowers in the Nabeul region; a production reference",
    coordinate: { latitude: 36.5, longitude: 10.7 },
    sourceName: "Governorate of Nabeul",
    sourceUrl:
      "https://www.nabeul.gov.tn/fr/la-production-des-fleurs-de-bigaradier-a-nabeul-depassera-les-2-500-tonnes/",
  },
  {
    scentId: "23",
    species: "Thuja occidentalis",
    region: "Ontario, Canada",
    rangeNote:
      "Northern white-cedar is native to eastern Canada and the adjoining northern United States",
    coordinate: { latitude: 46, longitude: -80 },
    sourceName: "USDA Forest Service — Silvics of North America",
    sourceUrl:
      "https://www.srs.fs.usda.gov/pubs/misc/ag_654/volume_1/thuja/occidentalis.htm",
  },
  {
    scentId: "24",
    species: "Pinus sylvestris",
    region: "Scotland, United Kingdom",
    rangeNote:
      "Scots pine is native across Europe to the Russian Far East and the Caucasus; one representative pine species",
    coordinate: { latitude: 57.1, longitude: -3.7 },
    ...kewSource("263353-1"),
  },
  {
    scentId: "25",
    species: "Polianthes tuberosa",
    region: "Guanajuato–Michoacán, Mexico",
    rangeNote:
      "Tuberose is native to southern Guanajuato and northern Michoacán; Agave amica is a botanical synonym",
    coordinate: { latitude: 20.1, longitude: -101.2 },
    ...kewSource("318009-2"),
  },
  {
    scentId: "26",
    species: "Cymbopogon citratus",
    region: "Southern India",
    rangeNote:
      "Kew's current distribution lists southern India and Sri Lanka as native; lemongrass is widely cultivated elsewhere",
    coordinate: { latitude: 10.5, longitude: 77 },
    ...kewSource("396896-1"),
  },
  {
    scentId: "27",
    species: "Coriandrum sativum",
    region: "Eastern Mediterranean, Türkiye",
    rangeNote:
      "Kew places the native range from the eastern Mediterranean to western Pakistan; long cultivation obscures its exact origin",
    coordinate: { latitude: 37, longitude: 35.5 },
    ...kewSource("840760-1"),
  },
  {
    scentId: "28",
    species: "Citrus × aurantium — bitter orange leaves",
    region: "San Pedro, Paraguay",
    rangeNote:
      "Petitgrain oil is distilled from bitter orange leaves and green branches in San Pedro; a production reference",
    coordinate: { latitude: -24, longitude: -56.5 },
    sourceName: "Paraguay Ministry of Public Works — biomass production study",
    sourceUrl:
      "https://minasyenergia.mopc.gov.py/pdf/PNCB/Estimacion%20del%20Consumo%20y%20Produccion%20de%20Biomasa.pdf",
  },
  {
    scentId: "29",
    species: "Cupressus sempervirens",
    region: "Crete, Greece",
    rangeNote:
      "Mediterranean cypress is native from the eastern Mediterranean to Iran; it is introduced in France and Italy",
    coordinate: { latitude: 35.2, longitude: 24.2 },
    ...kewSource("261974-1"),
  },
  {
    scentId: "30",
    species: "Elettaria cardamomum",
    region: "Western Ghats, India",
    rangeNote:
      "True cardamom is native to south-western India; Guatemala is a cultivation region",
    coordinate: { latitude: 9.8, longitude: 77.1 },
    ...kewSource("796556-1"),
  },
  {
    scentId: "2",
    species: "Lavandula angustifolia",
    region: "Southern France",
    rangeNote: "Naturally found in France, Spain and Italy",
    coordinate: { latitude: 44, longitude: 6 },
    sourceName: "Royal Botanic Gardens, Kew",
    sourceUrl: "https://www.kew.org/plants/english-lavender",
  },
  {
    scentId: "3",
    species: "Vanilla planifolia",
    region: "Southern Mexico",
    rangeNote:
      "Native from southern Mexico through Central America to northern Brazil",
    coordinate: { latitude: 19.5, longitude: -96.5 },
    sourceName: "Kew Plants of the World Online",
    sourceUrl:
      "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:262578-2",
  },
  {
    scentId: "4",
    species: "Cinnamomum verum",
    region: "Sri Lanka",
    rangeNote:
      "Native to Sri Lanka, with wild populations also in south-western India",
    coordinate: { latitude: 7, longitude: 81 },
    sourceName: "World Agroforestry — Agroforestree Database",
    sourceUrl:
      "https://apps.worldagroforestry.org/treedb2/AFTPDFS/Cinnamomum_verum.PDF",
  },
  {
    scentId: "21",
    species: "Syzygium aromaticum",
    region: "Maluku, Indonesia",
    rangeNote: "Naturally occurs in the Maluku Islands of Indonesia",
    coordinate: { latitude: 0.7, longitude: 127.5 },
    sourceName: "Kew Plants of the World Online",
    sourceUrl:
      "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:601421-1",
  },
].sort((first, second) => Number(first.scentId) - Number(second.scentId));
