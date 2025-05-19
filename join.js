// umvase iyi bolo uhite uyishira muri app.js yawe kugira ngo ubashe guselectinga relationship
SELECT 
    d.department_code,
    d.department_name,
    s.gross_salary,
    s.net_salary,
    s.total_dedication
FROM employee e
JOIN department d ON e.department_id = d.department_id
JOIN salary s ON e.salary_id = s.id;
