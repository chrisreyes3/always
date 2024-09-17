
document.addEventListener('DOMContentLoaded', () => {
    loadCustomers();
    loadCustomerNamesForSales();
    loadSales();
    addCustomerEventListeners();
});

function showTab(tabName) {
    let tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabName).style.display = 'block';
}

function addCustomer() {
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    let customer = {
        customerNumber: customers.length + 1,
        customerName: document.getElementById('customerName').value,
        category: document.getElementById('category').value,
        contactPerson: document.getElementById('contactPerson').value,
        tinNumber: document.getElementById('tinNumber').value,
        street: document.getElementById('street').value,
        barangay: document.getElementById('barangay').value,
        city: document.getElementById('city').value,
        email: document.getElementById('email').value,
        contactNumber: document.getElementById('contactNumber').value,
        pricePerBottle: document.getElementById('pricePerBottle').value,
        status: document.getElementById('status').value
    };
    customers.push(customer);
    localStorage.setItem('customers', JSON.stringify(customers));
    clearCustomerForm();
    loadCustomers();
    alert('Customer added successfully!');
}

function clearCustomerForm() {
    document.getElementById('customerFormElement').reset();
}

function loadCustomers() {
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    let customerTableBody = document.querySelector('#customerTable tbody');
    customerTableBody.innerHTML = '';
    customers.forEach(customer => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.customerNumber}</td>
            <td>${customer.customerName}</td>
            <td>${customer.category}</td>
            <td>${customer.contactPerson || ''}</td>
            <td>${customer.tinNumber}</td>
            <td>${customer.street}</td>
            <td>${customer.barangay}</td>
            <td>${customer.city}</td>
            <td>${customer.email}</td>
            <td>${customer.contactNumber}</td>
            <td>${customer.pricePerBottle}</td>
            <td class="${customer.status === 'Non-Active' ? 'non-active' : ''}">${customer.status}</td>
            <td class="no-print">
                <button onclick="deleteCustomer(${customer.customerNumber})">Delete</button>
                <button onclick="showMap('${customer.street}', '${customer.barangay}', '${customer.city}')">Show Map</button>
            </td>
        `;
        customerTableBody.appendChild(row);
    });
}

function deleteCustomer(customerNumber) {
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    customers = customers.filter(customer => customer.customerNumber !== customerNumber);
    localStorage.setItem('customers', JSON.stringify(customers));
    loadCustomers();
}

function showMap(street, barangay, city) {
    let address = `${street}, ${barangay}, ${city}`;
    let mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapUrl, '_blank');
}

function addCustomerEventListeners() {
    document.getElementById('category').addEventListener('change', function() {
        let contactPersonDiv = document.getElementById('contactPersonDiv');
        if (this.value === 'Commercial' || this.value === 'Industrial' || this.value === 'Government') {
            contactPersonDiv.style.display = 'block';
        } else {
            contactPersonDiv.style.display = 'none';
        }
    });
}

function loadCustomerNamesForSales() {
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    let salesCustomerName = document.getElementById('salesCustomerName');
    salesCustomerName.innerHTML = '<option value="">Select Customer</option>';
    customers.forEach(customer => {
        let option = document.createElement('option');
        option.value = customer.customerName;
        option.textContent = customer.customerName;
        salesCustomerName.appendChild(option);
    });
}
function addSales() {
    let sales = JSON.parse(localStorage.getItem('sales')) || [];
    let sale = {
        date: document.getElementById('salesDate').value,
        orderSlip: document.getElementById('orderSlip').value,
        orNumber: document.getElementById('orNumber').value,
        drNumber: document.getElementById('drNumber').value,
        qrCode: document.getElementById('qrCode').value,
        customerName: document.getElementById('salesCustomerName').value,
        pricePerBottle: document.getElementById('salesPricePerBottle').value, 
        slim: document.getElementById('slim').value,
        round: document.getElementById('round').value,
        otherItems: document.getElementById('otherItems').value,
        cashSales: document.getElementById('cashSales').value,
        accountReceivable: document.getElementById('accountReceivable').value,
        totalSales: document.getElementById('totalSales').value,
        remarks: document.getElementById('remarks').value,
        fuel: document.getElementById('Fuel').value,
        labTest: document.getElementById('labTest').value,
        supplies: document.getElementById('supplies').value,
        othersmisc: document.getElementById('othersmisc').value
    };
    sales.push(sale);
    localStorage.setItem('sales', JSON.stringify(sales));
    clearSalesForm();
    loadSales();
    alert('Sales added successfully!');
    location.reload(); // Refresh page after adding sales
}

// calculate sales
function calculateSales() {
    // Price calculation for bottles
    let pricePerBottleText = document.getElementById('salesPricePerBottle').value;
    let pricePerBottle = (pricePerBottleText === "3/100") ? 100 : parseFloat(pricePerBottleText);
    let slim = parseFloat(document.getElementById('slim').value) || 0;
    let round = parseFloat(document.getElementById('round').value) || 0;
    let otherItems = parseFloat(document.getElementById('otherItems').value) || 0;
    
    let totalBottles = slim + round + otherItems;
    let cashSales;
    
    if (pricePerBottleText === "3/100") {
        cashSales = Math.floor(totalBottles / 3) * 100 + (totalBottles % 3) * (pricePerBottle / 3);
    } else {
        cashSales = pricePerBottle * totalBottles;
    }

    // Calculate total sales without expenses
    document.getElementById('cashSales').value = cashSales.toFixed(2);
    let accountReceivable = parseFloat(document.getElementById('accountReceivable').value) || 0;
    let totalSales = (cashSales + accountReceivable).toFixed(2);

    // Add expenses deduction logic
    let fuel = parseFloat(document.getElementById('Fuel').value) || 0;
    let labTest = parseFloat(document.getElementById('labTest').value) || 0;
    let supplies = parseFloat(document.getElementById('supplies').value) || 0;
    let others = parseFloat(document.getElementById('othersmisc').value) || 0;

    // Deduct expenses from total sales
    let totalExpenses = fuel + labTest + supplies + others;
    let remainingSales = totalSales - totalExpenses;

    // Display the final remaining sales
    document.getElementById('totalSales').value = remainingSales.toFixed(2);
}

// calculate sales fin
function clearSalesForm() {
    document.getElementById('salesFormElement').reset();
}

// new load sales
function loadSales() {
    let sales = JSON.parse(localStorage.getItem('sales')) || [];
    
    // Sort sales in descending order by date
    sales.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let salesTableBody = document.querySelector('#salesTable tbody');
    salesTableBody.innerHTML = '';
    
    sales.forEach(sale => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.date}</td>
            <td>${sale.orderSlip}</td>
            <td>${sale.orNumber}</td>
            <td>${sale.drNumber}</td>
            <td>${sale.qrCode}</td>
            <td>${sale.customerName}</td>
            <td>${sale.pricePerBottle}</td>
            <td>${sale.slim}</td>
            <td>${sale.round}</td>
            <td>${sale.otherItems}</td>
            <td>${sale.cashSales}</td>
            <td>${sale.accountReceivable}</td>
            <td>${sale.totalSales}</td>
            <td>${sale.remarks}</td>
            <td>${sale.fuel}</td>
            <td>${sale.labTest}</td>
            <td>${sale.supplies}</td>
            <td>${sale.othersmisc}</td>
            <td class="no-print">
                <button onclick="deleteSales('${sale.date}', '${sale.customerName}')">Delete</button>
            </td>
        `;
        salesTableBody.appendChild(row);
    });
}


function deleteSales(date, customerName) {
    let sales = JSON.parse(localStorage.getItem('sales')) || [];
    sales = sales.filter(sale => sale.date !== date || sale.customerName !== customerName);
    localStorage.setItem('sales', JSON.stringify(sales));
    loadSales();
}

function printCustomerReport() {
    window.print();
}

function printSalesReport() {
    window.print();
}

// add costumer 
document.getElementById('salesCustomerName').addEventListener('change', (event) => {
    let customerName = event.target.value;
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    let customer = customers.find(c => c.customerName === customerName);
    document.getElementById('salesPricePerBottle').value = customer.pricePerBottle;
    calculateSales(); // Recalculate sales when customer changes
});

['slim', 'round', 'otherItems', 'accountReceivable'].forEach(id => {
    document.getElementById(id).addEventListener('input', calculateSales);
});


// qr code 
function startScan() {
    const qrCodeScanner = new Html5QrcodeScanner(
        "my-qr-reader", { fps: 10, qrbox: 250 });

    qrCodeScanner.render(onScanSuccess);
}

function onScanSuccess(decodedText, decodedResult) {
    // Handle the result here
    console.log(`Code matched = ${decodedText}`, decodedResult);

    // Set the value of the QR Code field in the sales form
    document.getElementById('qrCode').value = decodedText;

    // Optionally, stop scanning after a successful decode
    qrCodeScanner.clear();
}


// qr fin

// Add event listener for the "Expenses" button
document.getElementById('expensesBtn').addEventListener('click', function() {
    const expensesMenu = document.getElementById('expensesMenu');
    
    // Toggle visibility
    if (expensesMenu.style.display === 'none' || expensesMenu.style.display === '') {
        expensesMenu.style.display = 'block';  // Show menu
    } else {
        expensesMenu.style.display = 'none';   // Hide menu
    }
});

// Export Customer Report to Excel
function exportCustomerReport() {
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    if (customers.length === 0) {
        alert("No customer data to export!");
        return;
    }

    // Create a new workbook
    let wb = XLSX.utils.book_new();
    
    // Convert customer data to worksheet
    let ws = XLSX.utils.json_to_sheet(customers);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Customer Report");

    // Export the workbook
    XLSX.writeFile(wb, "Customer_Report.xlsx");
}

// Export Sales Report to Excel
function exportSalesReport() {
    let sales = JSON.parse(localStorage.getItem('sales')) || [];
    if (sales.length === 0) {
        alert("No sales data to export!");
        return;
    }

    // Create a new workbook
    let wb = XLSX.utils.book_new();

    // Convert sales data to worksheet
    let ws = XLSX.utils.json_to_sheet(sales);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sales Report");

    // Export the workbook
    XLSX.writeFile(wb, "Sales_Report.xlsx");
}
