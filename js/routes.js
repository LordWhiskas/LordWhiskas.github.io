//an array, defining the routes
import articleFormsHandler from "./articleFormsHandler.js";
export default [
    {
        //the part after '#' in the url (so-called fragment):
        hash:"welcome",
        ///id of the target html element:
        target:"router-view",
        //the function that returns content to be rendered to the target html element:
        getTemplate:(targetElm) =>
            document.getElementById(targetElm).innerHTML =
                document.getElementById("template-welcome").innerHTML,
    },
    {
        hash:"articles",
        target:"router-view",
        getTemplate: fetchAndDisplayArticles
    },
    {
        hash:"opinions",
        target:"router-view",
        getTemplate: createHtml4opinions
    },
    {
        hash:"addOpinion",
        target:"router-view",
        getTemplate: (targetElm) =>{
            let opinions;
            opinions = [];
            if (localStorage.myTreesComments) {
                opinions = JSON.parse(localStorage.myTreesComments);
            }
            document.getElementById("art").classList = null;
            document.getElementById("wel").classList = null;
            document.getElementById("opi").classList = null;
            document.getElementById("add").classList = "active";
            document.getElementById(targetElm).innerHTML = document.getElementById("template-addOpinion").innerHTML;
            document.getElementById("nameEL").value = "Anonymous";
            document.getElementById("contactChoice2").value = "No";
            document.getElementById("contactChoice3").value = "Yes";
            document.getElementById("contactChoice1").value = "Yes";
            document.getElementById("contactChoice2").onclick = function () {
                document.getElementById("nameEL").disabled = false;
                document.getElementById("contactChoice2").value = "Yes";
                document.getElementById("contactChoice1").value = "No";
            }
            document.getElementById("contactChoice1").onclick = function () {
                document.getElementById("nameEL").disabled = true;
                document.getElementById("contactChoice2").value = "No";
                document.getElementById("contactChoice1").value = "Yes";
            }
            document.getElementById("contactChoice3").onclick = function () {
                if (document.getElementById("contactChoice3").value === "No") {
                    document.getElementById("contactChoice3").value = "Yes";
                } else {
                    document.getElementById("contactChoice3").value = "No";
                }
            }
            let post;
            function processOpnFrmData(event) {
                event.preventDefault();
                var i;
                for (i = 0; i < opinions.length; i++){
                    if (opinions[i]["mail"] === document.getElementById("mailEl").value.trim()) {
                        console.log(opinions[i]["mail"]);
                        window.alert("Please, enter another mail");
                        return;
                    }
                }

                //1.prevent normal event (form sending) processing

                //2. Read and adjust data from the form (here we remove white spaces before and after the strings)
                const nopName = document.getElementById("nameEL").value.trim();
                const nopOpn = document.getElementById("recenzia").value.trim();
                const nopMail = document.getElementById("mailEl").value.trim();
                const nopUrl = document.getElementById("urlEl").value.trim();
                const nopRadio = document.getElementById("contactChoice1").value.trim();
                const nopRadio1 = document.getElementById("contactChoice2").value.trim();
                const nopFlag = document.getElementById("contactChoice3").value.trim();
                const nopDatalist = document.getElementById("keywords").value.trim();
                const title = document.getElementById("title1").value.trim();
                //const nopWillReturn = document.getElementById("willReturnElm").checked;
                //3. Verify the data
                if(nopName==="" || nopOpn==="" || nopMail==="" || nopUrl==="" || nopRadio==="" || nopRadio1==="" || nopFlag==="" || nopDatalist===""){
                    window.alert("Please, enter all data");
                    return;
                }

                //3. Add the data to the array opinions and local storage
                const newOpinion =
                    {
                        title:title,
                        author: nopName,
                        content: nopOpn,
                        mail:nopMail,
                        imageLink:nopUrl,
                        radio:nopRadio,
                        radio1:nopRadio1,
                        flag:nopFlag,
                        tags:nopDatalist,
                        dateCreated: new Date()
                    };
                post = JSON.stringify(newOpinion);
                console.log("New opinion:\n "+JSON.stringify(newOpinion));

                opinions.push(newOpinion);

                localStorage.myTreesComments = JSON.stringify(opinions);

                //5. Reset the form
                document.getElementById("myForm").reset(); //resets the form
                document.getElementById("nameEL").value = "Anonymous";
                document.getElementById("contactChoice2").value = "No";
                document.getElementById("contactChoice3").value = "Yes";
                document.getElementById("contactChoice1").value = "Yes";
                window.location.href="#opinions";
                const url1 = "https://wt.kpi.fei.tuke.sk/api/article"
                let xhr = new XMLHttpRequest();
                xhr.open('POST', url1, true);
                xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
                xhr.send(post);

                xhr.onload = function () {
                    if(xhr.status === 201) {
                        console.log("Post successfully created!");
                        alert("The post has been successfully created.");
                    }
                }
            }

            document.getElementById("myForm").addEventListener("submit", event => processOpnFrmData(event));
        }

    },
    {
        hash:"article",
        target:"router-view",
        getTemplate: fetchAndDisplayArticleDetail
    },
    {
        hash:"artEdit",
        target:"router-view",
        getTemplate: editArticle
    },
    {
        hash:"artDelete",
        target:"router-view",
        getTemplate: deleteArticle
    }
];
const urlBase = "https://wt.kpi.fei.tuke.sk/api";
const articlesPerPage = 20;
function createHtml4opinions(targetElm){
    document.getElementById("art").classList = null;
    document.getElementById("wel").classList = null;
    document.getElementById("opi").classList = "active";
    document.getElementById("add").classList = null;
    const opinionsFromStorage=localStorage.myTreesComments;
    let opinions=[];
    if(opinionsFromStorage){
        opinions=JSON.parse(opinionsFromStorage);
        opinions.forEach(opinion => {
            opinion.created = (new Date(opinion.created)).toDateString();
        });
    }
    document.getElementById(targetElm).innerHTML = Mustache.render(
        document.getElementById("template-opinions").innerHTML,
        opinions
    );
}
var currentUrl;
var offsetCurrent = 0;
var currentPage = 1;
function fetchAndDisplayArticles(targetElm,current,totalCount){
    document.getElementById("art").classList = "active";
    document.getElementById("wel").classList = null;
    document.getElementById("opi").classList = null;
    document.getElementById("add").classList = null;
    totalCount = parseInt(totalCount);
    current = parseInt(current);
    currentPage = current;
    if (currentUrl) {
        var url = "http://wt.kpi.fei.tuke.sk/api/article/?max=20&offset=";
        let offset = [];
        for (var i = currentUrl.length - 1; i >= 0; i--) {
            if (currentUrl[i] >= '0' && currentUrl[i] <= '9') {
                offset.splice(0, 0, currentUrl[i]);
                /*console.log(offset);*/
            } else {
                console.log("break");
                break;
            }
        }
        let number = "";
        for (var j = 0; j < offset.length; j++) {
            number = number.concat(offset[j]);
        }
        offsetCurrent = ((current - 1)*20).toString();
        console.log(number);
        url = url.concat(offsetCurrent);
    }
    else {
        var url = "http://wt.kpi.fei.tuke.sk/api/article/?max=20&offset=0";
        offsetCurrent = 0;
    }
    console.log("offsetCurrent:");
    console.log(offsetCurrent);
    function reqListener () {
        if (this.status == 200) {
            const responseJSON = JSON.parse(this.responseText);
            let number = Math.round(responseJSON["meta"]["totalCount"] /20);
            totalCount = number + 1;
            addArtDetailLink2ResponseJson(responseJSON);
            if(current>1){
                responseJSON.prevPage=current-1;
            }
            if(current<totalCount){
                responseJSON.nextPage=current+1;
            }
            responseJSON.currPage = offsetCurrent/20 + 1;
            console.log("currPage:");
            console.log(responseJSON.currPage);
            responseJSON.pageCount = totalCount;
            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    document.getElementById("template-articles").innerHTML,
                    responseJSON
                );

        } else {
            const errMsgObj = {errMessage:this.responseText};
            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    document.getElementById("template-articles-error").innerHTML,
                    errMsgObj
                );
        }
    }
    console.log(url)
    var ajax = new XMLHttpRequest();
    ajax.addEventListener("load", reqListener);
    ajax.open("GET", url, true);
    ajax.send();
    currentUrl = url;
}
function addArtDetailLink2ResponseJson(responseJSON){
    responseJSON.articles = responseJSON.articles.map(
        article =>(
            {
                ...article,
                detailLink:`#article/${article.id}/${responseJSON.meta.offset}/${responseJSON.meta.totalCount}`
            }
        )
    );
}
function fetchAndDisplayArticleDetail(targetElm,artIdFromHash,offsetFromHash,totalCountFromHash) {
    fetchAndProcessArticle(...arguments,false, false);
}

/**
 * Gets an article record from a server and processes it to html according to
 * the value of the forEdit parameter. Assumes existence of the urlBase global variable
 * with the base of the server url (e.g. "https://wt.kpi.fei.tuke.sk/api"),
 * availability of the Mustache.render() function and Mustache templates )
 * with id="template-article" (if forEdit=false) and id="template-article-form" (if forEdit=true).
 * @param targetElm - id of the element to which the acquired article record
 *                    will be rendered using the corresponding template
 * @param artIdFromHash - id of the article to be acquired
 * @param offsetFromHash - current offset of the article list display to which the user should return
 * @param totalCountFromHash - total number of articles on the server
 * @param forEdit - if false, the function renders the article to HTML using
 *                            the template-article for display.
 *                  If true, it renders using template-article-form for editing.
 * @param forDelete
 */
function fetchAndProcessArticle(targetElm,artIdFromHash,offsetFromHash,totalCountFromHash,forEdit, forDelete){
    const url = `${urlBase}/article/${artIdFromHash}`;

    console.log();
    function reqListener () {
        // stiahnuty text
        /*console.log(this.responseText)*/
        if (this.status == 200) {
            const responseJSON = JSON.parse(this.responseText);
            if(forEdit){
                responseJSON.formTitle="Article Edit";
                responseJSON.submitBtTitle="Save article";
                responseJSON.backLink=`#article/${artIdFromHash}/${offsetFromHash}/${totalCountFromHash}`;
                document.getElementById(targetElm).innerHTML =
                    Mustache.render(
                        document.getElementById("template-article-form").innerHTML,
                        responseJSON
                    );
                if(!window.artFrmHandler){
                    window.artFrmHandler= new articleFormsHandler("https://wt.kpi.fei.tuke.sk/api");
                }
                window.artFrmHandler.assignFormAndArticle("articleForm","hiddenElm",artIdFromHash,offsetFromHash,totalCountFromHash);
            }else{
                responseJSON.backLink=`#articles/${currentPage}/${Math.round(totalCountFromHash/20)}`;
                console.log(responseJSON.backLink);
                responseJSON.editLink=
                    `#artEdit/${responseJSON.id}/${offsetCurrent}/${totalCountFromHash}`;
                responseJSON.deleteLink=
                    `#artDelete/${responseJSON.id}/${offsetFromHash}/${totalCountFromHash}`;
                document.getElementById(targetElm).innerHTML =
                    Mustache.render(
                        document.getElementById("template-article").innerHTML,
                        responseJSON
                    );
            }
        } else {
            const errMsgObj = {errMessage:this.responseText};
            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    document.getElementById("template-articles-error").innerHTML,
                    errMsgObj
                );
        }

    }

    console.log(url)
    var ajax = new XMLHttpRequest();
    ajax.addEventListener("load", reqListener);
    if (forDelete == true) {
        ajax.open("DELETE", url, true);
        console.log("Deleted");
        alert("The page has been successfully removed.");
        ajax.send();
        fetchAndDisplayArticles(targetElm, currentPage, totalCountFromHash - 1);
        fetchAndDisplayArticles(targetElm, currentPage, totalCountFromHash - 1);
        return;
    }
    else {
        ajax.open("GET", url, true);
    }
    ajax.send();
}
function editArticle(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash) {
    fetchAndProcessArticle(...arguments,true, false);
}
function deleteArticle(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash){
    fetchAndProcessArticle(...arguments, true, true);
}
