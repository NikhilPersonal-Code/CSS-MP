const studName = document.getElementById("studName");
const percentage = document.getElementById("percentage");
const resultBody = document.getElementById("resultBody");
const studentIdentifier = localStorage.getItem("studentIdentifier");
document.title = studentIdentifier;
let result;
async function main() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const response = await fetch(`http://localhost:3000/api/getResult?studentIdentifier=${studentIdentifier}`, {
    method: "GET",
    headers: myHeaders,
  });
  result = await response.json();
  studName.textContent = result[0].name;
  percentage.textContent = `Percentage : ${result[0].percentage}`
}
main().then(() => {
  showResultInTable();
});
function showResultInTable() {
  for (let i = 0; i < result.length; i++) {
    let total_marks = 0;
    if ((result[i].subject_name == "ITR" || result[i].subject_name == "CPP")) {
      total_marks = result[i].practical_marks;
    } else if ((result[i].subject_name == "EST")) {
      total_marks = result[i].theory_marks;
    } else {
      total_marks = result[i].theory_marks + result[i].practical_marks;
    }
    resultBody.innerHTML += `<tr class="bg-white transition-all duration-500 hover:bg-[#ffffff37] dark:bg-[#ffffff12]">
                <th scope="row" class="px-6 py-4 font-medium text-white whitespace-nowrap dark:text-white">
                    ${result[i].subject_name}
                </th>
                <td class="px-6 py-4 text-white font-medium">
                    ${
                      result[i].theory_marks == null
                        ? "N/A"
                        : result[i].theory_marks
                    }
                    </td>
                <td class="px-6 py-4 text-white font-medium">
                    ${
                      result[i].practical_marks == null
                        ? "N/A"
                        : result[i].practical_marks
                    }
                </td>
                <td class="px-6 py-4 text-white font-medium">
                    ${total_marks}
                </td>
            </tr>`;
  }
}
