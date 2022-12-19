//an array, defining the routes
import articleFormsHandler from "./articleFormsHandler.js";
export default [
    {
        //the part after '#' in the url (so-called fragment):
        hash:"welcome",
        ///id of the target html element:
        target:"router-view",
        //the function that returns content to be rendered to the target html element:
        getTemplate:(targetElm) => {
            document.getElementById(targetElm).innerHTML =
                document.getElementById("template-welcome").innerHTML
            document.getElementById("googleButton").hidden = window.userInfo != null || window.location.hash != "#sign";
            document.getElementById("art").classList = null;
            document.getElementById("wel").classList = "active";
            document.getElementById("opi").classList = null;
            document.getElementById("add").classList = null;
            document.getElementById("acc").classList = null;
        }

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
            document.getElementById("googleButton").hidden = window.userInfo != null || window.location.hash != "#sign";
            document.getElementById("art").classList = null;
            document.getElementById("wel").classList = null;
            document.getElementById("opi").classList = null;
            document.getElementById("add").classList = "active";
            document.getElementById("acc").classList = null;
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
            if (window.userInfo != null){
                document.getElementById("nameEL").value = window.userInfo.name;
                document.getElementById("nameEL").disabled = false;
                document.getElementById("contactChoice2").value = "Yes";
                document.getElementById("contactChoice1").value = "No";
                document.getElementById("contactChoice1").checked = false;
                document.getElementById("contactChoice2").checked = true;
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
                xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
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
    },
    {
        hash: "sign",
        target: "router-view",
        getTemplate: sign
    }
];
const urlBase = "https://wt.kpi.fei.tuke.sk/api";
const articlesPerPage = 20;
function createHtml4opinions(targetElm){
    document.getElementById("googleButton").hidden = window.userInfo != null || window.location.hash != "#sign";
    document.getElementById("art").classList = null;
    document.getElementById("wel").classList = null;
    document.getElementById("opi").classList = "active";
    document.getElementById("add").classList = null;
    document.getElementById("acc").classList = null;
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
    document.getElementById("googleButton").hidden = window.userInfo != null || window.location.hash != "#sign";
    document.getElementById("art").classList = "active";
    document.getElementById("wel").classList = null;
    document.getElementById("opi").classList = null;
    document.getElementById("add").classList = null;
    document.getElementById("acc").classList = null;
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
            if (number*20 < responseJSON["meta"]["totalCount"]){
                number += 1;
            }
            totalCount = number;
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
            console.log(responseJSON);
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
    ajax.onload = function () {
        document.addEventListener("keyup", function(event) {
            if (event.keyCode === 13 && document.getElementById("goTo").value.trim() != "") {
                current = document.getElementById("goTo").value.trim();
                fetchAndDisplayArticles(targetElm, current, totalCount);
            }
        });
    }
}
function addArtDetailLink2ResponseJson(responseJSON){

    document.getElementById("googleButton").hidden = window.userInfo != null || window.location.hash != "#sign";
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
    document.getElementById("googleButton").hidden = window.userInfo != null || window.location.hash != "#sign";
    const url = `${urlBase}/article/${artIdFromHash}`;
    var result;
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
                result = responseJSON;
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
    const urlComment = `${urlBase}/article/${artIdFromHash}/comment`;
    console.log("Comment url:");
    console.log(urlComment);
    var responseJSONCopy;
    function reqListener1() {
        // stiahnuty text
        /*console.log(this.responseText)*/
        if (this.status == 200) {
            const responseJSON = JSON.parse(this.responseText);
            console.log("Comments:");
            console.log(responseJSON);
            if (responseJSON.comments.totalCount > responseJSON.comments.max){
                responseJSON.comments.totalCount = responseJSON.comments.max;
            }
            responseJSONCopy = responseJSON;
        }
        else {
            console.log("Comments Error");
        }
    }
    var ajax1 = new XMLHttpRequest();
    ajax1.addEventListener("load", reqListener1);
    ajax1.open("GET", urlComment, true);
    ajax1.send();
    ajax1.onload = function () {
        if(ajax1.status === 200) {
            console.log("Comment has been successfully read!");
            console.log(responseJSONCopy);
            if (result) {
                result.comments = [];
                for (var i = 0; i < responseJSONCopy.meta.totalCount; i++) {
                    result.comments[i] = [];
                    result.comments[i].push(responseJSONCopy.comments[i].id);
                    result.comments[i].push(responseJSONCopy.comments[i].author);
                    result.comments[i].push(responseJSONCopy.comments[i].dateCreated.slice(0, 10));
                    result.comments[i].push(responseJSONCopy.comments[i].lastUpdated);
                    result.comments[i].push(responseJSONCopy.comments[i].text);
                }
                console.log(result);
                document.getElementById(targetElm).innerHTML =
                    Mustache.render(
                        document.getElementById("template-article").innerHTML,
                        result
                    );
            }
            document.getElementById("commentSend").onclick = function () {
                document.getElementById("myForm1").hidden = null;
                if (window.userInfo != null){
                    document.getElementById("nameEL1").value = window.userInfo.name;
                    console.log("NONULL");
                }
                /*document.getElementById(targetElm).innerHTML = document.getElementById("template-article").innerHTML;*/
                let post;
                function processOpnFrmData(event) {
                    //1.prevent normal event (form sending) processing
                    event.preventDefault();

                    //2. Read and adjust data from the form (here we remove white spaces before and after the strings)

                    const nopName = document.getElementById("nameEL1").value.trim();
                    const nopOpn = document.getElementById("recenzia1").value.trim();
                    //const nopWillReturn = document.getElementById("willReturnElm").checked;

                    //3. Verify the data
                    if(nopName==="" || nopOpn===""){
                        window.alert("Please, enter all data");
                        return;
                    }

                    //3. Add the data to the array opinions and local storage
                    const newOpinion =
                        {
                            author: nopName,
                            text: nopOpn
                        };
                    post = JSON.stringify(newOpinion);
                    console.log("New opinion:\n "+JSON.stringify(newOpinion));
                    //5. Reset the form
                    document.getElementById("myForm1").reset(); //resets the form
                    const url2 = `https://wt.kpi.fei.tuke.sk/api/article/${artIdFromHash}/comment`;
                    let xhr1 = new XMLHttpRequest();
                    xhr1.open('POST', url2, true);
                    xhr1.setRequestHeader('Content-type','application/json; charset=utf-8');
                    xhr1.send(post);
                    fetchAndDisplayArticleDetail(targetElm,artIdFromHash,offsetFromHash,totalCountFromHash);
                    xhr1.onload = function () {
                        if(xhr1.status === 201) {
                            console.log("Comment successfully created!");
                            alert("The comment has successfully posted.");
                        }
                    }
                }
                document.getElementById("myForm1").addEventListener("submit", event => processOpnFrmData(event));
            }
        }
        else {
            console.log("Comment has not been read");
        }
    }

}
function editArticle(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash) {
    fetchAndProcessArticle(...arguments,true, false);
}
function deleteArticle(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash){
    fetchAndProcessArticle(...arguments, true, true);
}
function sign(targetElm) {
    document.getElementById("art").classList = null;
    document.getElementById("wel").classList = null;
    document.getElementById("opi").classList = null;
    document.getElementById("add").classList = null;
    document.getElementById("acc").classList = "active";

    if (window.userInfo) {
        document.getElementById("googleButton").hidden = true;
        document.getElementById(targetElm).innerHTML =
            Mustache.render(
                document.getElementById("googleSign").innerHTML,
                window.userInfo
            );
        document.getElementById("sgnOut").onclick = function () {
            window.location.href = "#welcome";
            window.userInfo = null;
        }
    }

    else {
        document.getElementById(targetElm).innerHTML =
            document.getElementById("googleReg").innerHTML
        console.log("NOTHING");
        document.getElementById("googleButton").hidden = false;
        document.getElementById("googleButton").hidden = window.userInfo != null || window.location.hash != "#sign";
    }
}
