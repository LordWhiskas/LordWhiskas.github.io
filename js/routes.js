//an array, defining the routes
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
                //const nopWillReturn = document.getElementById("willReturnElm").checked;
                //3. Verify the data
                if(nopName==="" || nopOpn==="" || nopMail==="" || nopUrl==="" || nopRadio==="" || nopRadio1==="" || nopFlag==="" || nopDatalist===""){
                    window.alert("Please, enter all data");
                    return;
                }

                //3. Add the data to the array opinions and local storage
                const newOpinion =
                    {
                        name: nopName,
                        comment: nopOpn,
                        mail:nopMail,
                        url:nopUrl,
                        radio:nopRadio,
                        radio1:nopRadio1,
                        flag:nopFlag,
                        datalist1:nopDatalist,
                        created: new Date()
                    };

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
            }

            document.getElementById("myForm").addEventListener("submit", event => processOpnFrmData(event));
        }

    }
];
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
function fetchAndDisplayArticles(targetElm,current,totalCount){
    document.getElementById("art").classList = "active";
    document.getElementById("wel").classList = null;
    document.getElementById("opi").classList = null;
    document.getElementById("add").classList = null;
    current=parseInt(current);
    totalCount=parseInt(totalCount);
    let opinions;
    opinions = [];
    var url = "http://wt.kpi.fei.tuke.sk/api/article/?max=20&offset=";
    url = url.concat(((current - 1) *20).toString());
    function reqListener () {

        // stiahnuty text
        if (this.status == 200) {
            document.getElementById(targetElm).innerHTML =
                opinions = JSON.parse(this.responseText);
            console.log(opinions);
            let number = Math.round(opinions["meta"]["totalCount"] /20);
            totalCount = number + 1;
            const data4rendering={
                currPage:current,
                pageCount:totalCount,
                author:opinions.articles,
                dateCreated:opinions.articles,
                imageLink:opinions.articles,
                title:opinions.articles,
                tags:opinions.articles
            };
            if(current>1){
                data4rendering.prevPage=current-1;
            }

            if(current<totalCount){
                data4rendering.nextPage=current+1;
            }

            document.getElementById(targetElm).innerHTML = Mustache.render(
                document.getElementById("template-articles").innerHTML,
                data4rendering
            );
        } else {
            alert("Došlo k chybe: " + this.statusText);
        }

    }
    console.log(url)
    var ajax = new XMLHttpRequest();
    ajax.addEventListener("load", reqListener);
    ajax.open("GET", url, true);
    ajax.send();

}
