function generateRandomCode() {
    const min = 10000;
    const max = 99999; 
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function is10MinutesAgo(inssuanceDate){
    const nowDate = new Date();
    const diffInMilliseconds = nowDate - inssuanceDate;
    const diffInMinutes = diffInMilliseconds / (1000 * 60); 
    return diffInMinutes >= 10    
}

module.exports = {generateRandomCode, is10MinutesAgo}