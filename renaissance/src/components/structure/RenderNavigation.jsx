import { Link, Route, Routes } from "react-router-dom";
import { AuthData } from "../../auth/AuthWrapper";
import { nav } from "./navigation";
import styles from "./renderNav.module.css"
import React, { useState, useEffect } from 'react';

export const RenderRoutes = () => {

        const { user, userRole } = AuthData();
        
        return (
             <Routes>
             { nav.map((r, i) => {

                if (r.isPrivate && userRole == "doctor" && r.isDoctor) {
                    return <Route key={i} path={r.path} element={r.element}/>
                } else if (r.isPrivate && userRole == "patsient" && !r.isDoctor) {
                       return <Route key={i} path={r.path} element={r.element}/>
                  } else if (!r.isPrivate) {
                       return <Route key={i} path={r.path} element={r.element}/>
                  } else return false
             })}
             
             </Routes>
        )
   }
   
 export  const RenderMenu = () => {
     const [scrollPosition, setScrollPosition] = useState(0);
     const stickyScrollPosition = 50; 
 
     useEffect(() => {
         const handleScroll = () => {
             setScrollPosition(window.scrollY);
         };
 
         window.addEventListener('scroll', handleScroll);
 
         return () => {
             window.removeEventListener('scroll', handleScroll);
         };
     }, []);
 
     const { user, userRole } = AuthData();
 
     const MenuItem = ({ r }) => {
         return (
             <div className={styles.menuItem}>
                 <Link to={r.path}>{r.name}</Link>
             </div>
         );
     };
 
     return (
         <div className={`${styles.menu} ${scrollPosition > stickyScrollPosition ? styles.sticky : ''}`}>
             {nav.map((r, i) => {
                 if (!r.isPrivate && r.isMenu) {
                    return <MenuItem key={i} r={r} />;
                 } else if (userRole == "patsient" && r.isMenu && r.isPrivate && !r.isDoctor) {
                    return <MenuItem key={i} r={r} />;
                 } else if (userRole == "doctor" && r.isMenu && r.isPrivate && r.isDoctor) {
                    return <MenuItem key={i} r={r} />;
                 } else {
                    return null;
                }
             })}
         </div>
     );
 };