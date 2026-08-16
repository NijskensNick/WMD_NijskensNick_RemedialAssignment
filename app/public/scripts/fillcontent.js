window.onload = () => {
    //event.preventDefault();
    let tablesFilter = "all";
    let piechartData = {
        sessionTime: 0,
        ssTime: 0,
        ptTime: 0
    }

    let piechartTestData = {
        sessionTime: 50000,
        ssTime: 4793,
        ptTime: 2980
    }

    // Fill piechart
    function FillPieChart(deviceName)
    {
        document.getElementById("piechart-name").innerHTML = ` ${deviceName}`;
        document.getElementById("piechart-chart").innerHTML = `<canvas id="piechart-canvas"></canvas>`;
        let data = piechartData;
        console.log(data);
        if(data.sessionTime == 0)
        {
            return;
        }
        let canvas = document.getElementById("piechart-canvas");
        let values = [(100 - ((data.ssTime + data.ptTime) / data.sessionTime) * 100), (data.ssTime / data.sessionTime * 100), (data.ptTime / data.sessionTime * 100)];
        let labels = ["Correct positioning", "Not allowed to stand still", "Not allowed to stand still or pass through"];
        let colors = ["green", "yellow", "red"];
        var chart = new Chart(canvas, {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    backgroundColor: colors,
                    data: values
                }]
            }
        });
    }

    // Fetch functions
    async function FetchStandingStillPairs(deviceName)
    {
        if(deviceName == "all") {
            let result = await fetch(`http://localhost:3000/StandingStillPairs`);
            return await result.json();
        }
        else {
            let result = await fetch(`http://localhost:3000/StandingStillPairs?devicename=${deviceName}`);
            return await result.json();
        }
    }
    async function FetchPassingThroughPairs(deviceName)
    {
        if(deviceName == "all") {
            let result = await fetch(`http://localhost:3000/PassingThroughPairs`);
            return await result.json();
        }
        else {
            let result = await fetch(`http://localhost:3000/PassingThroughPairs?devicename=${deviceName}`);
            return await result.json();
        }
    }
    async function FetchSessions(deviceName)
    {
        if(deviceName == "all") {
            let result = await fetch(`http://localhost:3000/Sessions`);
            return await result.json();
        }
        else {
            let result = await fetch(`http://localhost:3000/Sessions?devicename=${deviceName}`);
            return await result.json();
        }
    }
    async function FetchUsernames(deviceName)
    {
        if(deviceName == "all") {
            let result = await fetch(`http://localhost:3000/LoggedUserNames`);
            return await result.json();
        }
        else {
            let result = await fetch(`http://localhost:3000/LoggedUserNames?devicename=${deviceName}`);
            return await result.json();
        }
    }

    // Fill content tables
    async function FillStandingStillTable(deviceName) {
        FetchStandingStillPairs(deviceName).then(data => {
            piechartData.ssTime = 0;
            let HTMLstring = `<table><tr>
                    <th>ID</th>
                    <th>Device name</th>
                    <th>User name</th>
                    <th>Start time</th>
                    <th>End time</th>
                    <th>Ended</th>
                    <th>Delete</th>
                </tr>`;
            data.forEach((obj) => {
                if(obj.ended){
                    piechartData.ssTime += (Date.parse(obj.endTime) - Date.parse(obj.startTime));
                }
                HTMLstring += 
                `
                    <tr>
                        <th>${obj._id}</th>
                        <th>${obj.deviceName}</th>
                        <th>${obj.userName}</th>
                        <th>${obj.startTime}</th>
                        <th>${obj.endTime}</th>
                        <th>${obj.ended}</th>
                        <th><button class="deleteStandingStillDocument deleteButton" value=${obj._id}>Delete</button></th>
                    </tr>
                `
            });
            HTMLstring += `</table>`;
            document.getElementById("StandingStillContent").innerHTML = HTMLstring;
            AddStandingStillPairDeleteEvents();
        })
        .then(() => {FillPassingThroughTable(deviceName)})
    }
    async function FillPassingThroughTable(deviceName) {
        FetchPassingThroughPairs(deviceName).then(data => {
            piechartData.ptTime = 0;
            let HTMLstring = `<table><tr>
                    <th>ID</th>
                    <th>Device name</th>
                    <th>User name</th>
                    <th>Start time</th>
                    <th>End time</th>
                    <th>Ended</th>
                    <th>Delete</th>
                </tr>`;
            data.forEach((obj) => {
                if(obj.ended){
                    piechartData.ptTime += (Date.parse(obj.endTime) - Date.parse(obj.startTime));
                }
                HTMLstring += 
                `
                    <tr>
                        <th>${obj._id}</th>
                        <th>${obj.deviceName}</th>
                        <th>${obj.userName}</th>
                        <th>${obj.startTime}</th>
                        <th>${obj.endTime}</th>
                        <th>${obj.ended}</th>
                        <th><button class="deletePassingThroughDocument deleteButton" value=${obj._id}>Delete</button></th>
                    </tr>
                `
            });
            HTMLstring += `</table>`;
            document.getElementById("PassingThroughContent").innerHTML = HTMLstring;
            AddPassingThroughDeleteEvents();
        })
        .then(() => {FillSessionsTable(deviceName)})
    }
    async function FillSessionsTable(deviceName) {
        FetchSessions(deviceName).then(data => {
            piechartData.sessionTime = 0;
            let HTMLstring = `<table><tr>
                    <th>ID</th>
                    <th>Device name</th>
                    <th>User name</th>
                    <th>Start time</th>
                    <th>End time</th>
                    <th>Ended</th>
                    <th>Delete</th>
                </tr>`;
            data.forEach((obj) => {
                if(obj.ended){
                    piechartData.sessionTime += (Date.parse(obj.endTime) - Date.parse(obj.startTime));
                }
                HTMLstring += 
                `
                    <tr>
                        <th>${obj._id}</th>
                        <th>${obj.deviceName}</th>
                        <th>${obj.userName}</th>
                        <th>${obj.startTime}</th>
                        <th>${obj.endTime}</th>
                        <th>${obj.ended}</th>
                        <th><button class="deleteSessionDocument deleteButton" value=${obj._id}>Delete</button></th>
                    </tr>
                `
            });
            HTMLstring += `</table>`;
            document.getElementById("SessionsContent").innerHTML = HTMLstring;
            AddSessionDeleteEvents();
        })
        .then(() => {FillUsernamesTable(deviceName)})
    }
    async function FillUsernamesTable(deviceName) {
        FetchUsernames(deviceName).then(data => {
            let HTMLstring = `<table><tr>
                    <th>ID</th>
                    <th>Device name</th>
                    <th>User name</th>
                    <th>Delete</th>
                </tr>`;
            data.forEach((obj) => {
                HTMLstring += 
                `
                    <tr>
                        <th>${obj._id}</th>
                        <th>${obj.deviceName}</th>
                        <th>${obj.userName}</th>
                        <th><button class="deleteUsernameDocument deleteButton" value=${obj._id}>Delete</button></th>
                    </tr>
                `
            });
            HTMLstring += `</table>`;
            document.getElementById("UsernamesContent").innerHTML = HTMLstring;
            AddUsernameDeleteEvents();
        })
        .then(FillPieChart(deviceName))
    }
    function FillTables(deviceName){
        FillStandingStillTable(deviceName);
    }

    async function FetchDeviceNames()
    {
        let result = await fetch(`http://localhost:3000/LoggedDeviceNames`);
        return await result.json();
    }

    function FillDropdown(){
        FetchDeviceNames().then(data => {
            let HTMLstring = `<option value="all"><p class="dropdown-option">All</p></option>`;
            data.forEach((obj) => {
                HTMLstring += `<option value="${obj.deviceName}"><p class="dropdown-option">${obj.deviceName}</p></option>`;
            });
            document.getElementById("dropdown-options").innerHTML = HTMLstring;
        }).then(() => {
            document.getElementById("dropdown-options").addEventListener("change", (event) => {
                console.log(event.target.value);
                tablesFilter = event.target.value;
                FillTables(tablesFilter);
            })
        }).then(() => {FillTables(tablesFilter)})
    }

    function AddStandingStillPairDeleteEvents(){
            Array.from(document.getElementsByClassName("deleteStandingStillDocument")).forEach((obj) => {
                obj.addEventListener('click', () => {
                    DeleteDBEntry("StandingStillPairs", obj.value);
                })
        })
    }
    function AddPassingThroughDeleteEvents(){
        Array.from(document.getElementsByClassName("deletePassingThroughDocument")).forEach((obj) => {
            obj.addEventListener('click', () => {
                DeleteDBEntry("PassingThroughPairs", obj.value);
            })
        })
    }
    function AddSessionDeleteEvents(){
        Array.from(document.getElementsByClassName("deleteSessionDocument")).forEach((obj) => {
            obj.addEventListener('click', () => {
                DeleteDBEntry("Sessions", obj.value);
            })
        })
    }
    function AddUsernameDeleteEvents(){
        Array.from(document.getElementsByClassName("deleteUsernameDocument")).forEach((obj) => {
            obj.addEventListener('click', () => {
                DeleteDBEntry("LoggedUserNames", obj.value);
            })
        })
    }

    async function DeleteDBEntry(table, id){
        await fetch(`http://localhost:3000/${table}/${id}`, {
            method: "DELETE",
            headers: {
                'Content-type': 'application/json'
            }
        }).then(() => {
            FillTables(tablesFilter);
        });
    }
    
    FillDropdown();
}
