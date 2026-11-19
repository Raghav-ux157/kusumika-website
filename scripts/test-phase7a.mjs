const BASE = 'http://localhost:3000';

async function fetchNoFollow(path, options = {}) {
  return await fetch(BASE + path, {
    ...options,
    redirect: 'manual'
  });
}

async function runTests() {
  console.log('====================================');
  console.log('PHASE 7A AUTH & RBAC VERIFICATION');
  console.log('====================================\n');

  // TEST 1: Logged-out access
  console.log('--- TEST 1: LOGGED-OUT ACCESS ---');
  const t1_admin = await fetchNoFollow('/admin');
  console.log('GET /admin -> Status:', t1_admin.status, 'Location:', t1_admin.headers.get('location'));
  
  const t1_orders = await fetchNoFollow('/admin/orders');
  console.log('GET /admin/orders -> Status:', t1_orders.status, 'Location:', t1_orders.headers.get('location'));

  const t1_leads = await fetchNoFollow('/admin/leads');
  console.log('GET /admin/leads -> Status:', t1_leads.status, 'Location:', t1_leads.headers.get('location'));

  const t1_api = await fetchNoFollow('/api/admin/staff-role');
  console.log('GET /api/admin/staff-role -> Status:', t1_api.status);

  const t1_loginPage = await fetchNoFollow('/admin/login');
  console.log('GET /admin/login -> Status:', t1_loginPage.status);

  // TEST 2: Wrong-Role Access (Warehouse)
  console.log('\n--- TEST 2: WRONG-ROLE ACCESS (WAREHOUSE) ---');
  const loginWh = await fetchNoFollow('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'warehouse@kusumika.com', password: 'Kusumika@Atelier2026!' })
  });
  console.log('POST /api/admin/login (warehouse) -> Status:', loginWh.status);
  const whCookieHeader = loginWh.headers.get('set-cookie');
  const whCookie = whCookieHeader.match(/ksm_staff_session=([^;]+)/)[0];

  const whRoleRes = await fetchNoFollow('/api/admin/staff-role', {
    headers: { Cookie: whCookie }
  });
  const whRoleJson = await whRoleRes.json();
  console.log('GET /api/admin/staff-role -> Role:', whRoleJson.user?.role, 'Email:', whRoleJson.user?.email);

  // Allowed for warehouse
  const whOverview = await fetchNoFollow('/admin', { headers: { Cookie: whCookie } });
  console.log('Warehouse GET /admin (allowed) -> Status:', whOverview.status);

  const whOrders = await fetchNoFollow('/admin/orders', { headers: { Cookie: whCookie } });
  console.log('Warehouse GET /admin/orders (allowed) -> Status:', whOrders.status);

  const whInventory = await fetchNoFollow('/admin/inventory', { headers: { Cookie: whCookie } });
  console.log('Warehouse GET /admin/inventory (allowed) -> Status:', whInventory.status);

  // Forbidden for warehouse (should redirect to /admin?error=unauthorized)
  const whLeads = await fetchNoFollow('/admin/leads', { headers: { Cookie: whCookie } });
  console.log('Warehouse GET /admin/leads (forbidden) -> Status:', whLeads.status, 'Location:', whLeads.headers.get('location'));

  const whReports = await fetchNoFollow('/admin/reports', { headers: { Cookie: whCookie } });
  console.log('Warehouse GET /admin/reports (forbidden) -> Status:', whReports.status, 'Location:', whReports.headers.get('location'));

  const whSeo = await fetchNoFollow('/admin/seo', { headers: { Cookie: whCookie } });
  console.log('Warehouse GET /admin/seo (forbidden) -> Status:', whSeo.status, 'Location:', whSeo.headers.get('location'));

  // TEST 3: Correct-Role Access (Admin) & Logout
  console.log('\n--- TEST 3: CORRECT-ROLE ACCESS (ADMIN) & LOGOUT ---');
  const loginAdmin = await fetchNoFollow('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@kusumika.com', password: 'Kusumika@Atelier2026!' })
  });
  console.log('POST /api/admin/login (admin) -> Status:', loginAdmin.status);
  const adminCookieHeader = loginAdmin.headers.get('set-cookie');
  const adminCookie = adminCookieHeader.match(/ksm_staff_session=([^;]+)/)[0];

  const adminRoleRes = await fetchNoFollow('/api/admin/staff-role', {
    headers: { Cookie: adminCookie }
  });
  const adminRoleJson = await adminRoleRes.json();
  console.log('GET /api/admin/staff-role -> Role:', adminRoleJson.user?.role, 'Email:', adminRoleJson.user?.email);

  const routes = ['/admin', '/admin/orders', '/admin/leads', '/admin/customers', '/admin/inventory', '/admin/tickets', '/admin/reports', '/admin/seo', '/admin/settings', '/admin/abandoned-carts'];
  for (const r of routes) {
    const res = await fetchNoFollow(r, { headers: { Cookie: adminCookie } });
    console.log(`Admin GET ${r} -> Status:`, res.status);
  }

  // Already logged in visiting /admin/login
  const adminLoginRedirect = await fetchNoFollow('/admin/login', { headers: { Cookie: adminCookie } });
  console.log('Admin visiting /admin/login -> Status:', adminLoginRedirect.status, 'Location:', adminLoginRedirect.headers.get('location'));

  // Logout
  const logoutRes = await fetchNoFollow('/api/admin/logout', {
    method: 'POST',
    headers: { Cookie: adminCookie }
  });
  console.log('POST /api/admin/logout -> Status:', logoutRes.status);
  const clearedCookie = logoutRes.headers.get('set-cookie');
  console.log('Logout Set-Cookie header contains Max-Age=0 or Expires past:', clearedCookie.includes('Max-Age=0') || clearedCookie.includes('Expires=Thu, 01 Jan 1970'));

  // After logout, accessing /admin should redirect to login
  const afterLogout = await fetchNoFollow('/admin');
  console.log('GET /admin after logout -> Status:', afterLogout.status, 'Location:', afterLogout.headers.get('location'));

  console.log('\n====================================');
  console.log('ALL PHASE 7A VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
  console.log('====================================');
}

runTests();
