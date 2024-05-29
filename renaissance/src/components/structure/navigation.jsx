import { Account } from "../pages/Account/Account"
import { Home } from "../pages/Home/Home"
import { Login } from "../pages/Login/Login"
import { PrivateRoom } from "../pages/Private/Private"
import { Service } from "../pages/Service/Service"
import { DoctorAccount } from "../pages/DoctorAccount/DoctorAccount"
import { DoctorRoom } from "../pages/DoctorRoom/DoctorRoom"
import Slider  from "../pages/Personal/Personal"
import Contact from "../pages/Contacts/Contacts"

export const nav = [
     { path:     "/",         name: "Главная",        element: <Home />,       isMenu: false,     isPrivate: false  },
     { path:     "/service",    name: "Услуги",       element: <Service />,      isMenu: true,     isPrivate: false  },
     { path:     "/personal",    name: "Персонал",       element: <Slider />,      isMenu: true,     isPrivate: false  },
     { path:     "/contacts",    name: "Контакты",       element: <Contact />,      isMenu: false,     isPrivate: false  },
     { path:     "/login",    name: "Аккаунт",       element: <Login />,      isMenu: false,    isPrivate: false  },
     { path:     "/private",  name: "Комната приема",     element: <PrivateRoom />,    isMenu: true,     isPrivate: true , isDoctor: false },
     { path:     "/account",  name: "Личный кабинет",     element: <Account />,    isMenu: true,     isPrivate: true , isDoctor: false },
     { path:     "/room",  name: "Комната приема",     element: <DoctorRoom />,    isMenu: true,     isPrivate: true, isDoctor: true  },
     { path:     "/doctor",  name: "Личный кабинет",     element: <DoctorAccount />,    isMenu: true,     isPrivate: true, isDoctor: true  },

]