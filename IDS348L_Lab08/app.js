const express = require('express');
const connection = require('./db');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
// Set the view engine to 'ejs'
app.set('view engine', 'ejs');


// Set the directory where your views (HTML templates) are located
app.set('views', __dirname + '/views');

app.get('/irSuppliers', (req, res) => {
    res.sendFile(__dirname + '/views/suppliers.html');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
  });

app.get('/suppliers', (req, res) => {
    const query = 'SELECT * FROM Suppliers';

    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).send('Error fetching suppliers');
        return;
      }
  
      const suppliers = results; // Suppliers data fetched from the database
  
      // Render the 'suppliers' view and pass the suppliers data
      res.render('suppliers', { suppliers });
    });
});

app.get('/load-more-suppliers', (req, res) => {
    const page = req.query.page || 1; // Get the page number from the query parameter
    const itemsPerPage = 10; // Number of items to load per page
  
    // Calculate the offset based on the page number and items per page
    const offset = (page - 1) * itemsPerPage;
  
    // Fetch more supplier data based on the page number and offset
    const query = `SELECT * FROM Suppliers LIMIT ?, ?`;
    const values = [offset, itemsPerPage];
  
    connection.query(query, values, (error, results) => {
      if (error) {
        console.error('Error fetching more suppliers:', error);
        res.status(500).json({ error: 'Error fetching more suppliers' });
        return;
      }
  
      const moreSuppliers = results; // Additional supplier data fetched from the database
  
      // Send the additional supplier data as a JSON response
      res.json({ suppliers: moreSuppliers });
    });
  });
  

app.post('/insertSupplier', (req, res) => {
    const {
        SupplierName,
        ContactName,
        Address,
        City,
        PostalCode,
        Country,
        Phone,
      } = req.body;
    
      // Call the stored procedure
      const sql = 'CALL InsertSupplier(?, ?, ?, ?, ?, ?, ?)';
      connection.query(
        sql,
        [SupplierName, ContactName, Address, City, PostalCode, Country, Phone],
        (error, results) => {
          if (error) {
            console.error('Error executing stored procedure:', error);
            res.status(500).json({ success: false, message: 'Error inserting supplier' });
            return;
          }
          
          console.log('Supplier inserted successfully');
          res.status(200).json({ success: true, message: 'Supplier inserted successfully' });
        }
      );
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
