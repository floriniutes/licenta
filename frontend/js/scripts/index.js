import {toast} from "react-toastify";
export const serverAddress = 'http://localhost:8081/app';

export const tilesPacient = [
  {
    faIcon: 'fas fa-pencil-alt',
    description: 'Programează-te',
    backgroundImage: '../img/consultatie.png',
    link: '/#/main/formular-programare'
  },
  {
    faIcon: 'fas fa-calendar-alt',
    description: 'Listă programări',
    backgroundImage: '../img/appointment.png',
    link: '/#/main/lista-programari/list'
  },
  {
    faIcon: 'fas fa-cog',
    description: 'Profil',
    backgroundImage: '../img/setari.png',
    link: '/#/main/profil'
  }
];

export const choicePatient = [
  {
    faIcon: 'fas fa-calendar-alt',
    description: 'Data',
    link: '/#/main/istoric-programari/data'
  },
  {
    faIcon: 'fa fa-user-md',
    description: 'Doctor',
    link: '/#/main/istoric-programari/nume'
  },
  {
    faIcon: 'fa fa-archive',
    description: 'Toate consultațiile',
    link: '/#/main/istoric-programari/arhiva'
  }
];

export const choiceDoctor = [
  {
    faIcon: 'fas fa-calendar-alt',
    description: 'Data',
    link: '/#/main/istoric-programari/data'
  },
  {
    faIcon: 'fas fa-user',
    description: 'Pacient',
    link: '/#/main/istoric-programari/nume'
  },
  {
    faIcon: 'fa fa-archive',
    description: 'Toate consultațiile',
    link: '/#/main/istoric-programari/arhiva'
  }
];


export const tilesDoctor = [
  {
    faIcon: 'fas fa-calendar-alt',
    description: 'Listă programări',
    backgroundImage: '../img/appointment.png',
    link: '/#/main/lista-programari/list'
  },
  {
    faIcon: 'fas fa-cog',
    description: 'Profil',
    backgroundImage: '../img/setari.png',
    link: '/#/main/profil'
  }
];

export const tilesAssistant = [
  {
    faIcon: 'fas fa-pencil-alt',
    description: 'Programați un pacient',
    backgroundImage: '../img/consultatie.png',
    link: '/#/main/formular-programare'
  },
  {
    faIcon: 'fas fa-calendar-alt',
    description: 'Listă programări pacienți',
    backgroundImage: '../img/appointment.png',
    link: '/#/main/lista-programari/list'
  },
  {
    faIcon: 'fas fa-cog',
    description: 'Profil',
    backgroundImage: '../img/setari.png',
    link: '/#/main/profil'
  }
];

export const GDPRMessage = 'Clinica utilizează fişiere de tip cookie pentru a personaliza și îmbunătăți experiența ta pe Website-ul nostru. Te informăm că ne-am actualizat politicile pentru a integra în acestea si în activitatea curentă cele mai recente modificări propuse de Regulamentul (UE) 2016/679 privind protecția persoanelor fizice în ceea ce privește prelucrarea datelor cu caracter personal și privind libera circulație a acestor date. Prin continuarea navigării pe Website-ul nostru confirmi acceptarea utilizării fişierelor de tip cookie.';

export const validationWarning = [
  {
    validationType: 'password',
    text: 'Parola trebuie să conțină minim 6 caractere și să fie compusă din: litere mici, mari și cifre'
  }, {
    validationType: 'pin',
    text: 'CNP-ul introdus nu este valid'
  }, {
    validationType: 'email',
    text: 'Email-ul introdus nu este valid'
  }, {
    validationType: 'lettersOnly',
    text: 'Sunt acceptate doar litere și "-"'
  }, {
    validationType: 'phoneNumber',
    text: 'Introduceți un număr de telefon valid'
  }
];

export const notify = function(message, type) {
  toast(message, {type: type === 'success' ? toast.TYPE.SUCCESS : type === 'error' ?  toast.TYPE.ERROR : toast.TYPE.INFO});
};

export const validatePid = function (value) {
  let i = 0, year = 0, hashResult = 0, cnp = [], hashTable = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
  if (value.length !== 13) {
    return false;
  }
  for (i = 0; i < 13; i++) {
    cnp[i] = parseInt(value.charAt(i), 10);
    if (isNaN(cnp[i])) {
      return false;
    }
    if (i < 12) {
      hashResult = hashResult + ( cnp[i] * hashTable[i] );
    }
  }
  hashResult = hashResult % 11;
  if (hashResult === 10) {
    hashResult = 1;
  }
  year = (cnp[1] * 10) + cnp[2];
  switch (cnp[0]) {
    case 1  :
    case 2 : {
      year += 1900;
    }
      break;
    case 3  :
    case 4 : {
      year += 1800;
    }
      break;
    case 5  :
    case 6 : {
      year += 2000;
    }
      break;
    case 7  :
    case 8 :
    case 9 : {
      year += 2000;
      if (year > ( parseInt(new Date().getYear(), 10) - 14 )) {
        year -= 100;
      }
    }
      break;
    default : {
      return false;
    }
  }
  if (year < 1800 || year > 2099) {
    return false;
  }
  return ( cnp[12] === hashResult );
};

export const validateEmail = function (value) {
  let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(value);
};

export const validatePhoneNumber = function (value) {
  let re = /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/;
  return re.test(value);
};

export const validateLettersOnly = function (value) {
  let re = /^[A-Za-z\- ]+$/;
  return re.test(value);
};

export const validatePassword = function (value) {
  let re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  return re.test(value);
};