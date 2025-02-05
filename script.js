let entries = JSON.parse(localStorage.getItem("entries")) || [];
updateUI();

document.getElementById("add-btn").addEventListener("click", function () {
    const type = document.getElementById("type").value;
    const description = document.getElementById("description").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;

    if (!description || isNaN(amount) || amount <= 0 || !date) {
        alert("Please fill in all fields correctly.");
        return;
    }

    const entry = { id: Date.now(), type, description, amount, date };
    entries.push(entry);
    localStorage.setItem("entries", JSON.stringify(entries));

    updateUI();
    resetForm();
});

document.getElementById("reset-btn").addEventListener("click", resetForm);

document.querySelectorAll('input[name="filter"]').forEach(radio => {
    radio.addEventListener("change", updateUI);
});

function updateUI() {
    const filter = document.querySelector('input[name="filter"]:checked').value;
    const filteredEntries = filter === "all" ? entries : entries.filter(entry => entry.type === filter);
    
    const tableBody = document.getElementById("entries-list");
    tableBody.innerHTML = "";
    
    let totalIncome = 0;
    let totalExpense = 0;

    filteredEntries.forEach(entry => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.type}</td>
            <td>${entry.description}</td>
            <td>${entry.amount}</td>
            <td>${entry.date}</td>
            <td>
                <button class="edit-btn" onclick="editEntry(${entry.id})">Edit</button>
                <button class="delete-btn" onclick="deleteEntry(${entry.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);

        if (entry.type === "income") {
            totalIncome += entry.amount;
        } else {
            totalExpense += entry.amount;
        }
    });

    document.getElementById("total-income").textContent = totalIncome;
    document.getElementById("total-expense").textContent = totalExpense;
    document.getElementById("net-balance").textContent = totalIncome - totalExpense;
}

function editEntry(id) {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;

    document.getElementById("type").value = entry.type;
    document.getElementById("description").value = entry.description;
    document.getElementById("amount").value = entry.amount;
    document.getElementById("date").value = entry.date;

    deleteEntry(id);
}

function deleteEntry(id) {
    entries = entries.filter(entry => entry.id !== id);
    localStorage.setItem("entries", JSON.stringify(entries));
    updateUI();
}

function resetForm() {
    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("date").value = "";
}