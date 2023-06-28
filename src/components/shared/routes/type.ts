export type RouteInfo = {
    linkName: string,
    path: string,
    requiredLogin?:boolean;
    requiredRole? : {key: string, role:string}
};