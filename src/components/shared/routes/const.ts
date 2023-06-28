import { RouteInfo } from "./type";

export const accueilPath = "/accueil";
export const authentificationPath = "/auth";
export const logoutPath = "/logout";
export const usersPath = "/users";
export const roadsPath = "/roads";
export const sensorPath = "/sensor/:sensorId";
export const interventionPath = "/interventions";
export const newInterventionPath = "/newIntervention";
export const teamPath = "/team";

export const allRoutes = [
    {linkName: "Accueil", path: accueilPath,},
    {linkName: "L'équipe", path:teamPath},
    {linkName: "Connexion", path:authentificationPath, requiredLogin:false,},
    {linkName: "Logout", path:logoutPath, requiredLogin:true,},
    {linkName: "Users", path:usersPath, requiredRole:{key:"key", role:"collectivite"}},
    {linkName: "Routes", path:roadsPath},
    {linkName: "Interventions", path:interventionPath},
] as RouteInfo[];