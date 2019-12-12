// All weight are counted by pounds
// All height are counted by inches
const breed = {
'Affenpinscher': {
    "Male":{hMax: 11.5, hMin: 9, wMax: 10,wMin: 7}, 
    "Female":{hMax: 11.5, hMin: 9, wMax: 10,wMin: 7}, 
    lifeMin: 12, lifeMax: 15, group: 'Toy'},
'Afghan hound': {
    "Male":{hMax: 27, hMin: 25, wMax: 60,wMin: 50}, 
    "Female":{hMax: 27, hMin: 25, wMax: 60,wMin: 50}, 
    lifeMin: 12, lifeMax: 18, group: 'Hound'},
'Airedale terrie': {
    "Male":{hMax: 23, hMin: 23, wMax: 70,wMin: 50}, 
    "Female":{hMax: 23, hMin: 23, wMax: 70,wMin: 50}, 
    lifeMin: 11, lifeMax: 14, group: 'Terrier'},
'Akit': null,
'Alaskan malamute': {
    "Male":{hMax: 25, hMin: 25, wMax: 85,wMin: 85}, 
    "Female":{hMax: 23, hMin: 23, wMax: 75,wMin: 75}, 
    lifeMin: 12, lifeMax: 15, group: 'Working'},
'American eskimo dog': {
    "Male":{hMax: 19, hMin: 17, wMax: 35,wMin: 28}, 
    "Female":{hMax: 17, hMin: 15, wMax: 33,wMin: 25}, 
    lifeMin: 13, lifeMax: 15, group: 'Non-Sporting'},
'American foxhound': null,
'American staffordshire terrier': null,
'American water spaniel': null,
'Anatolian shepherd dog': null,
'Australian cattle dog': null,
'Australian shepherd': {
    "Male":{hMax: 23, hMin: 20, wMax: 65,wMin: 50}, 
    "Female":{hMax: 21, hMin: 18, wMax: 55,wMin: 40}, 
    lifeMin: 12, lifeMax: 15, group: 'Herding'},
'Australian terrier': null,
'Basenji': null,
'Basset hound': {
    "Male":{hMax: 15, hMin: null , wMax: 65,wMin: 40}, 
    "Female":{hMax: 13, hMin: null, wMax: 65,wMin: 40}, 
    lifeMin: 12, lifeMax: 13, group: 'Hound'},
'Beagle': {
    "Male":{hMax: 15, hMin: 13, wMax: 30,wMin: 20}, 
    "Female":{hMax: 13, hMin: null, wMax: 20,wMin: null}, 
    lifeMin: 10, lifeMax: 15, group: 'Hound'},
'Bearded collie': null,
'Beauceron': null,
'Bedlington terrier': null,
'Belgian malinois': null,
'Belgian sheepdog': null,
'Belgian tervuren': null,
'Bernese mountain dog': null,
'Bichon frise': null,
'Black and tan coonhound': null,
'Black russian terrier:{}': null,
'Bloodhound': null,
'Bluetick coonhound': null,
'Border collie': null,
'Border terrier': null,
'Borzoi': null,
'Boston terrier': null,
'Bouvier des flandres': null,
'Boxer': null,
'Boykin spaniel': null,
'Briard': null,
'Brittany': null,
'Brussels griffon': null,
'Bull terrier': null,
'Bulldog': null,
'Bullmastiff': null,
'Cairn terrier': null,
'Canaan dog': null,
'Cane corso': null,
'Cardigan welsh corgi': null,
'Cavalier king charles spaniel': null,
'Chesapeake bay retriever': null,
'Chihuahua': {
    "Male":{hMax: 8, hMin: 5, wMax: 6,wMin: null}, 
    "Female":{hMax: 8, hMin: 5, wMax: 6,wMin: null}, 
    lifeMin: 14, lifeMax: 16, group: 'Toy'},
'Chinese crested': null,
'Chinese shar-pei': null,
'Chow chow': null,
'Clumber spaniel': null,
'Cocker spaniel': null,
'Collie': null,
'Curly-coated retriever': null,
'Dachshund': null,
'Dalmatian': null,
'Dandie dinmont terrier': null,
'Doberman pinscher': {
    "Male":{hMax: 28, hMin: 26, wMax: 100,wMin: 75}, 
    "Female":{hMax: 26, hMin: 24, wMax: 90,wMin: 60}, 
    lifeMin: 10, lifeMax: 12, group: 'Working'},
'Dogue de bordeaux': null,
'English cocker spaniel': null,
'English setter': null,
'English springer spaniel': null,
'English toy spaniel': null,
'Entlebucher mountain dog': null,
'Field spaniel': null,
'Finnish spitz': null,
'Flat-coated retriever': null,
'French bulldog': {
    "Male":{hMax: 13, hMin: 11, wMax: 28,wMin: null}, 
    "Female":{hMax: 13, hMin: 11, wMax: 28,wMin: null}, 
    lifeMin: 10, lifeMax: 12, group: 'Non-Sporting'},
'German pinscher': null,
'German shepherd dog': null,
'German shorthaired pointer': null,
'German wirehaired pointer': null,
'Giant schnauzer': null,
'Glen of imaal terrier': null,
'Golden retriever': {
    "Male":{hMax: 24, hMin: 23, wMax: 75,wMin: 65}, 
    "Female":{hMax: 22.5, hMin: 21.5, wMax: 65,wMin: 55}, 
    lifeMin: 10, lifeMax: 12, group: 'Sporting'},
'Gordon setter': null,
'Great dane': null,
'Great pyrenees': null,
'Greater swiss mountain dog': null,
'Greyhound': null,
'Havanese': null,
'Husky': {
    "Male":{hMax: 23.5, hMin: 21, wMax: 60,wMin: 45}, 
    "Female":{hMax: 22, hMin: 20, wMax: 50,wMin: 35}, 
    lifeMin: 12, lifeMax: 14, group: 'Working'},
'Ibizan hound': null,
'Icelandic sheepdog': null,
'Irish red and white setter': null,
'Irish setter': null,
'Irish terrier': null,
'Irish water spaniel': null,
'Irish wolfhound': null,
'Italian greyhound': null,
'Japanese chin': null,
'Keeshond': null,
'Kerry blue terrier': null,
'Komondor': null,
'Kuvasz': null,
'Labrador retriever': {
    "Male":{hMax: 24.5, hMin: 22.5, wMax: 80,wMin: 65}, 
    "Female":{hMax: 23.5, hMin: 21.5, wMax: 70,wMin: 55}, 
    lifeMin: 10, lifeMax: 12, group: 'Sporting'},
'Lakeland terrier': null,
'Leonberger': null,
'Lhasa apso': null,
'Lowchen': null,
'Maltese': null,
'Manchester terrier': null,
'Mastiff': null,
'Miniature schnauzer': null,
'Neapolitan mastiff': null,
'Newfoundland': null,
'Norfolk terrier': null,
'Norwegian buhund': null,
'Norwegian elkhound': null,
'Norwegian lundehund': null,
'Nova scotia duck tolling retriever': null,
'Old english sheepdog': null,
'Otterhound': null,
'Papillon': null,
'Parson russell terrier': null,
'Pekingese': null,
'Pembroke welsh corgi': {
    "Male":{hMax: 12, hMin: 10, wMax: 30, wMin: null}, 
    "Female":{hMax: 12, hMin: 10, wMax: 28, wMin: null}, 
    lifeMin: 12, lifeMax: 13, group: 'Herding'},
'Petit basset griffon vendeen': null,
'Pharaoh hound': null,
'Plott': null,
'Pointer': null,
'Pomeranian': null,
'Poodle': null,
'Portuguese water dog': null,
'Pug': {
    "Male":{hMax: 13, hMin: 10, wMax: 18, wMin: 14}, 
    "Female":{hMax: 13, hMin: 10, wMax: 18, wMin: 14}, 
    lifeMin: 13, lifeMax: 15, group: 'Toy'},
'Samoyed': {
    "Male":{hMax: 23.5, hMin: 21, wMax: 65,wMin: 45}, 
    "Female":{hMax: 21, hMin: 19, wMax: 50,wMin: 35}, 
    lifeMin: 12, lifeMax: 14, group: 'Working'},
'Saint bernard': null,
'Silky terrier': null,
'Shiba Inu': {
    "Male":{hMax: 16.5, hMin: 14.5, wMax: 25,wMin: null}, 
    "Female":{hMax: 8, hMin: 13.5, wMax: 18, wMin: null}, 
    lifeMin: 13, lifeMax: 16, group: 'Non-Sporting'},
'Smooth fox terrier': null,
'Tibetan mastiff': null,
'Welsh springer spaniel': null,
'Wirehaired pointing griffon': null,
'Xoloitzcuintli': null,
'Yorkshire terrier': null,
"Other": null
}

// console.log("Yorkshire terrier" in breed)

function getBreeds(){
    // return all dog types in one array
    return Object.keys(breed);
}
module.exports = {
    breed,
    getBreeds
};
