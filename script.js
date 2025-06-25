body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f0f0f5;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

.card {
  background: white;
  padding: 15px 20px;
  margin-bottom: 20px;
  border-left: 5px solid #007bff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  border-radius: 5px;
}

.card h2 {
  margin-top: 0;
  font-size: 1.2rem;
}

ul {
  list-style: none;
  padding-left: 0;
}

ul li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  font-size: 0.95rem;
}

@media (max-width: 600px) {
  .container {
    padding: 10px;
  }

  .card {
    padding: 10px;
  }
}
