import Router from "./paramHashRouter.js";
import Routes from "./routes.js";
window.router = new Router(Routes,"welcome");
document.getElementById("wel").onclick= function (){
    document.getElementById("art").classList = null;
    document.getElementById("wel").classList = "active";
    document.getElementById("opi").classList = null;
    document.getElementById("add").classList = null;
}
