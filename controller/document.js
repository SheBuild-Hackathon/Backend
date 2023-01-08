const Marksheet = require("../models/masksheet");

// module.exports = ({ studentname, parentname, university, certificateId, physics, chemistry, mathematics, computerscience }) => {
//     const today = new Date();
//     return `
//    <html lang="en">

//    <head>
//        <meta charset="UTF-8">
//        <meta name="viewport" content="width=device-width, initial-scale=1.0">
//        <title>Document</title>
//    </head>
   
//    <body>
//        <div style="width:900px; height:700px; padding:20px; text-align:center; border: 10px solid #787878">
//            <div style="width:850px; height:650px; padding:20px; text-align:center; border: 5px solid #787878">
//                <span style="font-size:50px; font-weight:bold">${university}</span><br /><br />
//                <span style="font-size:20px; font-weight:bold">Mark sheet</span><br />
//                <br />
//                <span style="font-size:25px"><i>Congrats !!</i></span>
//                <br />
//                <span style="font-size:30px"><b>${studentname},son of ${parentname} has successfully cleared all the
//                        subject</b></span><br /><br />
   
//                <table align="center" border="12">
//                    <TR>
//                        <TD width="500">Marksheet number:</TD>
//                        <TD>
//                            <FONT face="arial" id="demoins"></FONT>${certificateId}
//                        </TD>
//                    </TR>
   
//                    </TR>
//                    <TR>
//                        <TH colspan="8" width="240"> Subjects Marks </TH>
//                    </TR>
//                    <TR>
//                        <TD width="500">Physics:</TD>
//                        <TD>
//                            <FONT face="arial" id="demooffice"></FONT>${physics}
//                        </TD>
//                    </TR>
//                    <TR>
//                        <TD width="500">Chemistry:</TD>
//                        <TD>
//                            <FONT face="arial" id="demoweb"></FONT>${chemistry}
//                        </TD>
//                    </TR>
//                    <TD width="500">Mathematics:</TD>
//                    <TD>
//                        <FONT face="arial" id="demoit"></FONT>${mathematics}
//                    </TD>
//                    </TR>
//                    <TR>
//                        <TD width="500">Computer Science:</TD>
//                        <TD>
//                            <FONT face="arial" id="democ"></FONT>${computerscience}
//                        </TD>
//                    </TR>
//                    <TR>
//                        <TH colspan="500" width="500"> Marks Result </TH>
//                    </TR>
//                    <TR>
//                        <TD width="500">TOTAL Marks:</TD>
//                        <TD>
//                            <FONT face="arial" id="demototal">${parseInt(physics) + parseInt(chemistry) +
//         parseInt(mathematics) + parseInt(computerscience)}</FONT></TT>
//                        </TD>
//                    </TR>
//                    <TR>
//                        <TD width="500">Total Percentage:</TD>
//                        <TD>
//                            <FONT face="arial" id="demoper">${((parseInt(physics) + parseInt(chemistry) +
//             parseInt(mathematics) + parseInt(computerscience)) / 400) * 100}%</FONT>
//                        </TD>
//                    </TR>
   
//                </table>
//                <span style="font-size:25px"><i>Date : </i>${`${today.getDate()}. ${today.getMonth() + 1}.
//                    ${today.getFullYear()}.`}</span><br>
   
   
//            </div>
//        </div>
   
//    </body>
   
//    </html>

//     `;
// };

const pdf = require('html-pdf');
const zipLocal = require("zip-local")
const markSheetTemp = ({rollno,name,branch,semester,sgpa,attendence,percentage,cd,oops,electronics,dsa,co}) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Marksheet</title>
        <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300&display=swap" rel="stylesheet">
        <style>
        #body { overflow: hidden; }
        .container{
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #body{
            background-color: rgb(199, 157, 99);
            height: 10px;
            align-self: left;
            
        }   
        .SchoolName{
            text-align: center;
            font-size: 25px;
            font-family: 'Libre Baskerville', serif;
            font-weight: bolder;
            color: rgb(199, 157, 99);
            
        }
        .Marksheet{
            font-family: 'Titillium Web', sans-serif;
            align-self: center;
            /* border-bottom: 5px solid rgb(199, 157, 99); */
            /* width: 1000px; */
            
            
        }
        .logo{
            
            color:rgb(199, 157, 99) ;
        
        }
        .logo img{
            height: 100px;
            margin: 80px 6px;
            margin-top: 0px;
            color: rgb(199, 157, 99);
        }
        #Details1{
            font-family: 'Source Sans Pro', sans-serif;
            margin-top: 30px;
            margin-left: 20px;
            
        
        }
        #Details1{
            font-family: 'Source Sans Pro', sans-serif;
            margin-top: 30px;
            border-spacing: 10px  ;
            margin-left: 20px;
        }
        
        /* label{
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            text-align: right;
            width: 400px;
            line-height: 26px;
            margin-bottom: 10px;
            
        } */
        input{
            height: 20px;
            flex: 0 0 10px;
            margin-right: 135px;
        }
        .class{
            border: 10px;
            padding-top: 50px;
            padding-left: 30px;
            margin: 30px;
            
        }
        th{
            width: 1150px;
            height: 40px;
            border: 2.5px solid white;
            background-color: rgb(222, 184, 130) ;
            font-weight: 100;
            font:bolder;
            text-align: center;
        }
        table, tr, td{
            width: 860px;
            height: 40px;
            border: 10px solid white;
            background-color: rgb(223, 220, 220) ;
            font-weight: 100;
            font:bolder;
        }
        
        #class1{
            border: 10px;
            padding-top: 50px;
            padding-left: 100px;
        }
        
        </style>
    </head>
    <body>
        <div id="body">
         
        </div>
        <div class="container">
            <div class="SchoolName">
            <h1>IIIT Sonepat</h1>
            <div class="Marksheet">
    
                <h2>Marksheet</h2>
            </div>
        </div>
        <div class="logo">
            
        </div> 
        
    </div>
    <div id="body"></div>
        <div id="Details1">
            <label"><b>Name</b></h1></label>
            ${name}
            <label"><b>Roll No.:</b></label>
            ${rollno}
            <label"><b>Branch:</b></label>
            ${branch}
            <label"><b>Semester:</b></label>
            ${semester}
        </div>
        <div class="class">
            <table>
                <tr>
                    <th><b>SUBJECTS</b></th>
                    <th><b>MARKS OBTAINED</b></th>              
                    <th><b>MAX MARKS</b></th>              
                </tr>
                <tr>
                    <td><b>CD</b></td>
                    <td>${cd}</td>
                    <td>100</td>
                </tr>
                <tr>
                    <td><b>OOPS</b></td>
                    <td>${oops}</td>
                    <td>100</td>
                </tr>
                <tr>
                    <td><b>Electronics</b></td>
                    <td>${electronics}</td>
                    <td>100</td>
                </tr>
                <tr>
    
                    <td><b>DSA</b> </td>
                    <td>${dsa}</td>
                    <td>100</td>
                </tr> 
                <tr>
    
                    <td><b>CO</b></td>
                    <td>${co}</td>
                    <td>100</td>
                </tr> 
                
                <table><td><b>SGPA</b>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp${sgpa}</td> 
                            </table> 
                        
                
            </table>
                
        </div>
        <div class="class">
            <table>
                <tr>
                    <td><b>ATTENDANCE</b>&nbsp&nbsp&nbsp&nbsp${attendence}</td>
                    <td><b>PERCENTAGE%</b>&nbsp&nbsp&nbsp&nbsp${percentage}</td>
                </tr>
            </table>
            <table>
                <div id="class1"></div>
                
                
    </body>
    </html> 
    `
};

module.exports.marksheetGeneration = async (req,res) => {
    
    let data = [];
    let body = req.body;
    console.log(body)

    if(body.length >1) body.shift();
    
    for(let i=0;i<body.length;i++){
        let obj = {
            rollno: body[i][0],
            name: body[i][1],
            branch: body[i][2],
            semester: body[i][3],
            sgpa: body[i][4],
            attendence: body[i][5],
            percentage: body[i][6],
            cd: body[i][7],
            oops: body[i][8],
            electronics: body[i][9],
            dsa: body[i][10],
            co: body[i][11],
        }
        data.push(obj);
    }
let urls = []
    for(let i=0;i<data.length;i++){
        console.log(i);
        await pdf.create(markSheetTemp(data[i]), {}).toFile(`./Marksheets/${data[i].rollno}.pdf`, (err) => {
            if (err) {
                // res.send(Promise.reject());
                console.log(err);
            }
            else console.log("Made")
        });
    }

    for(let i=0;i<data.length;i++){
        let obj = {
            url: `${req.protocol}://${req.get('host')}/marksheet/${data[i].rollno}.pdf`,
            roll: data[i].rollno
        }
        urls.push(obj)
    }
    console.log(urls)
    // zipLocal.sync.zip("./Marksheets").compress().save("Marksheets.zip")

    // res.sendFile(`${__dirname}/certificate.pdf`)

    // res.download("Marksheets.zip");
    setTimeout(() => {
        res.status(200).json({
            message:"Folder created",
            urls
        })
    }, 15000);

}

// module.exports.zip = async(req,res) => {
    
    

//     res.status(200).json({
//         message:"Done",
//         data:
//     })
//     // res.status(200).json({
//     //     message:"Folder created"
//     // })
// }
