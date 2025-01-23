import { redirect } from "react-router-dom";
import client from "../connection";
import { setCookie } from "./cookieSetter";
import { jsPDF } from "jspdf";

const getAllData = async () => {
  try {
    const response = await client.get("/barang");
    return response.data;
  } catch (error) {
    console.error("Failed to load catalog data:", error);
    throw new Error("Failed to load catalog data");
  }
};

const RegisterAction = async (data) => {
  const formData = await data.request.formData();
  const credentials = Object.fromEntries(formData);

  try {
    const response = await client.post("/register", credentials);

    if (response.status === 201) {
      alert(response.data.message);
      return redirect("/login");
    } else {
      throw new Error(response.data.message || "Registration failed");
    }
  } catch (error) {
    if (error.response && error.response.data) {
      alert(error.response.data.message);
    } else {
      alert(error.message || "An unexpected error occurred.");
    }
    return null;
  }
};

const LoginAction = async (data) => {
  const formData = await data.request.formData();
  const credentials = Object.fromEntries(formData);

  try {
    const response = await client.post("/login", credentials);
    console.log("Backend Response:", response.data);

    const { token, currUser } = response.data;

    if (!token || !currUser) {
      return { error: "Invalid response from server." };
    }

    const combinedData = JSON.stringify({ token, currUser });
    setCookie("authData", combinedData, 1);

    if (currUser.role === 1) {
      return redirect("/admin/home");
    } else if (currUser.role === 2) {
      return redirect("/user/home");
    } else {
      return { error: "Role not recognized." };
    }
  } catch (error) {
    return {
      error: error.response?.data?.message || "An unexpected error occurred.",
    };
  }
};

const getCookie = (name) => {
  const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    acc[key] = value;
    return acc;
  }, {});
  return cookies[name] ? decodeURIComponent(cookies[name]) : null;
};

const getUsername = () => {
  try {
    const authData = getCookie("authData");

    if (!authData) {
      throw new Error("Authentication data not found in cookies.");
    }

    const { token, currUser } = JSON.parse(authData);

    console.log("Token:", token);
    console.log("Current User:", currUser);

    return { token, username: currUser.username, role: currUser.role };
  } catch (error) {
    console.error("Error retrieving authentication data:", error.message);
    return null;
  }
};

// buat ngecek role
export const authLoader = () => {
  return getUsername() || { token: null, username: null, role: null };
};

// show barang variable

const showBarang = async () => {
  try {
    const response = await client.get("/barang");
    return response.data;
  } catch (error) {
    console.error("Failed to load catalog data:", error);
    throw new Error("Failed to load catalog data");
  }
};

const showDetailBarang = async (params) => {
  try {
    const { id } = params;
    const response = await client.get(`/barang/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch barang:", error);
    throw new Error("Something is wrong :)");
  }
};

const showActiveKupon = async () => {
  try {
    const response = await client.get(`/kupon/active`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch barang:", error);
    throw new Error("Something is wrong :)");
  }
};

// concat handler

const adminHomeHandler = async () => {
  try {
    const username = getUsername();
    const barang = await showBarang();
    const combine = { user: username, barang };
    return combine;
  } catch (error) {
    console.error("Error in admin loader:", error);
    throw new Error("Failed to load data.");
  }
};

const adminDetailHandler = async ({ params }) => {
  try {
    const username = getUsername();
    const barang = await getDetail(params.id);

    return {
      user: username,
      barang: barang,
    };
  } catch (error) {
    console.error("Error in adminDetailHandler:", error.message);
    throw new Error("Failed to fetch admin detail data.");
  }
};

const addBarangHandler = async () => {
  try {
    const username = getUsername();
    const jenis = await showJenis();
    const barang = await getAllData();

    return {
      user: username,
      jenis: jenis,
      barang: barang,
    };
  } catch (error) {
    console.error("Error in adminDetailHandler:", error.message);
    throw new Error("Failed to fetch admin detail data.");
  }
};

const editBarangHandler = async ({ params }) => {
  try {
    const username = getUsername();
    const barang = await getDetail(params.id);
    const jenis = await showJenis();

    return {
      user: username,
      barang: barang,
      jenis: jenis,
    };
  } catch (error) {
    console.error("Error in adminDetailHandler:", error.message);
    throw new Error("Failed to fetch admin detail data.");
  }
};

const adminKuponHandler = async () => {
  try {
    const username = getUsername();
    const kupon = await showKupon();

    return {
      user: username,
      kupon: kupon,
    };
  } catch (error) {
    console.error("Error in adminKuponHandler:", error.message);
    throw new Error("Failed to fetch admin kupon data.");
  }
};

const adminTransaksiHandler = async () => {
  try {
    const username = getUsername();
    const transactions = await showTransactions();

    return {
      user: username,
      transactions: transactions,
    };
  } catch (error) {
    console.error("Error in adminTransaksiHandler:", error.message);
    throw new Error("Failed to fetch admin transaction data.");
  }
};

const adminJenisHandler = async () => {
  try {
    const username = getUsername();
    const jenis = await showJenis();

    return {
      user: username,
      jenis: jenis,
    };
  } catch (error) {
    console.error("Error in adminJenisHandler:", error.message);
    throw new Error("Failed to fetch admin jenis data.");
  }
};

const registerAdminHandler = async () => {
  try {
    const username = getUsername();
    const users = await showAllUsers();

    return {
      user: username,
      users: users,
    };
  } catch (error) {
    console.error("Error in registerAdminHandler:", error.message);
    throw new Error("Failed to fetch admin user data.");
  }
};

const adminCartHandler = async () => {
  try {
    const username = getUsername();
    const cart = await showAdminCart();
    const kupon = await showActiveKupon();

    return {
      user: username,
      cart: cart,
      kupon: kupon,
    };
  } catch (error) {
    console.error("Error in userCartHandler:", error.message);
    throw new Error("Failed to fetch user cart data.");
  }
};

const adminReportHandler = async () => {
  try {
    const username = getUsername();
    const report = await adminReport();

    return {
      user: username,
      report: report,
    };
  } catch (error) {
    console.error("Error in adminReportHandler:", error.message);
    throw new Error("Failed to fetch admin report data.");
  }
};

const adminTransData = async () => {
  try {
    const response = await client.get("/admin/report/admin", {
      headers: {
        Authorization: `Bearer ${getUsername().token}`, // Sertakan token di header Authorization
      },
    });

    return response.data; // Mengembalikan data dari response
  } catch (error) {
    console.error("Error in adminTransData:", error.message);
    throw new Error("Failed to fetch admin transaction data.");
  }
};

export const adminTransReportHandler = async () => {
  try {
    const username = getUsername();
    const transactions = await adminTransData();

    return {
      user: username,
      transactions: transactions,
    };
  } catch (error) {
    console.error("Error in adminTransReportHandler:", error.message);
    throw new Error("Failed to fetch admin transaction report data.");
  }
};

// admin handler

const getDetail = async (id) => {
  try {
    const response = await client.get(`/barang/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch barang:", error);
    throw new Error("Something is wrong :)");
  }
};

const getDetailHome = async (params) => {
  try {
    // Destructure the `id` from the params object
    const { id } = params;

    // Send the ID as a query parameter
    const response = await client.get(`/barang/${id}`);

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch barang:", error);
    throw new Error("Something is wrong :)");
  }
};

const showJenis = async () => {
  try {
    const response = await client.get("/jenis");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch jenis:", error);
    throw new Error("Something is wrong :)");
  }
};

const showKupon = async () => {
  try {
    const response = await client.get("/kupon");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch kupon:", error);
    throw new Error("Something is wrong :)");
  }
};

const showTransactions = async () => {
  try {
    const response = await client.get("/transaction");

    return response.data;
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    throw new Error("Failed to fetch transactions.");
  }
};

const showAllUsers = async () => {
  try {
    const response = await client.get("/users");

    return response.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw new Error("Failed to fetch users.");
  }
};

const addBarang = async (data) => {
  const formData = await data.request.formData();
  const credentials = Object.fromEntries(formData);

  const authData = getUsername();
  if (!authData || !authData.token) {
    alert("Authorization failed. Please log in.");
    return null;
  }

  try {
    const response = await client.post("/admin/barang", credentials, {
      headers: {
        Authorization: `bearer ${authData.token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 201) {
      alert(response.data.message);
    } else {
      throw new Error(response.data.message || "Failed to add barang.");
    }
  } catch (error) {
    if (error.response && error.response.data) {
      alert(error.response.data.message);
    } else {
      alert(error.message || "An unexpected error occurred.");
    }
    return null;
  }
};

const editBarang = async ({ request, params }) => {
  const { id } = params;

  // Parse the form data
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);

  const authData = getUsername();
  if (!authData || !authData.token) {
    alert("Authorization failed. Please log in.");
    return null;
  }

  try {
    const response = await client.put(`/admin/barang/${id}`, credentials, {
      headers: {
        Authorization: `Bearer ${authData.token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      alert(response.data.message);
      return redirect("/admin/home");
    } else {
      throw new Error(response.data.message || "Failed to edit barang.");
    }
  } catch (error) {
    if (error.response && error.response.data) {
      alert(error.response.data.message);
    } else {
      alert(error.message || "An unexpected error occurred.");
    }
    return null;
  }
};

const formatDateToYYYYMMDD = (date) => {
  console.log("Original date:", date, "Type:", typeof date);
  const jsDate = new Date(date); // Ubah menjadi objek Date
  const year = jsDate.getFullYear();
  const month = String(jsDate.getMonth() + 1).padStart(2, "0");
  const day = String(jsDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  console.log("Formatted date:", formattedDate);
  return formattedDate;
};

const addKupon = async (data) => {
  const formData = await data.request.formData();
  const credentials = Object.fromEntries(formData);

  // Konversi format tanggal jika ada
  if (credentials.exp_date) {
    credentials.exp_date = formatDateToYYYYMMDD(credentials.exp_date);
  }

  console.log(formatDateToYYYYMMDD(credentials.exp_date));

  const authData = getUsername();
  if (!authData || !authData.token) {
    alert("Authorization failed. Please log in.");
    return null;
  }

  try {
    const response = await client.post("/admin/kupon", credentials, {
      headers: {
        Authorization: `Bearer ${authData.token}`,
      },
    });

    if (response.status === 201) {
      alert(response.data.message);
      showKupon();
    } else {
      throw new Error(response.data.message || "Failed to add kupon.");
    }
  } catch (error) {
    alert(error.message);
  }
};

const addJenis = async (data) => {
  const formData = await data.request.formData();
  const credentials = Object.fromEntries(formData);

  const authData = getUsername();
  if (!authData || !authData.token) {
    alert("Authorization failed. Please log in.");
    return null;
  }

  try {
    const response = await client.post("/admin/jenis", credentials, {
      headers: {
        Authorization: `Bearer ${authData.token}`,
      },
    });

    if (response.status === 201) {
      alert(response.data.message);
      showJenis();
    } else {
      throw new Error(response.data.message || "Failed to add kupon.");
    }
  } catch (error) {
    alert(error.message);
  }
};

const registerAnotherAdmin = async (data) => {
  const formData = await data.request.formData();
  const credentials = Object.fromEntries(formData);

  const authData = getUsername();
  if (!authData || !authData.token) {
    alert("Authorization failed. Please log in.");
    return null;
  }

  try {
    const response = await client.post("/admin/register", credentials, {
      headers: {
        Authorization: `Bearer ${authData.token}`,
      },
    });

    if (response.status === 201) {
      alert(response.data.message);
    } else {
      throw new Error(response.data.message || "Registration failed");
    }
  } catch (error) {
    if (error.response && error.response.data) {
      alert(error.response.data.message);
    } else {
      alert(error.message || "An unexpected error occurred.");
    }
    return null;
  }
};

const showAdminCart = async () => {
  try {
    const response = await client.get("/admin/cart", {
      headers: {
        Authorization: `Bearer ${getUsername().token}`,
      },
    });

    // Jika data cart kosong, kembalikan objek default
    if (response.data.length < 1) {
      return { cart: { cart: [], subtotal: 0 } }; // Default structure
    }
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn("Cart not found: Keranjang Anda kosong.");
      return { cart: { cart: [], subtotal: 0 } }; // Default structure
    }

    console.error("Failed to fetch cart:", error);
    throw new Error("Something is wrong :)");
  }
};

const adminReport = async () => {
  const authData = getUsername();
  if (!authData || !authData.token) {
    alert("Authorization failed. Please log in.");
    return null;
  }

  try {
    const response = await client.get("/admin/report", {
      headers: {
        Authorization: `Bearer ${authData.token}`,
      },
    });

    if (!response.data || response.data.length < 1) {
      return { report: [] }; // Default structure
    }
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn("No items have been sold.");
      return { report: [] }; // Default structure
    }

    console.error("Failed to fetch the report:", error);
    throw new Error("Something went wrong while fetching the report.");
  }
};

// user handler

const showCart = async () => {
  try {
    const response = await client.get("/users/cart", {
      headers: {
        Authorization: `Bearer ${getUsername().token}`,
      },
    });

    // Jika data cart kosong, kembalikan objek default
    if (response.data.length < 1) {
      return { cart: { cart: [], subtotal: 0 } }; // Default structure
    }
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn("Cart not found: Keranjang Anda kosong.");
      return { cart: { cart: [], subtotal: 0 } }; // Default structure
    }

    console.error("Failed to fetch cart:", error);
    throw new Error("Something is wrong :)");
  }
};

const userHomeHandler = async () => {
  try {
    const username = getUsername();
    const barang = await showBarang();
    return { user: username, barang: barang };
  } catch (error) {
    console.error("Error in user loader:", error);
    throw new Error("Failed to load data.");
  }
};

const userDetailHandler = async ({ params }) => {
  try {
    const username = getUsername();
    const barang = await getDetail(params.id);
    const barangs = await showBarang();

    return {
      user: username,
      barang: barang,
      barangs: barangs
    };
  } catch (error) {
    console.error("Error in adminDetailHandler:", error.message);
    throw new Error("Failed to fetch admin detail data.");
  }
};

const userCartHandler = async () => {
  try {
    const username = getUsername();
    const cart = await showCart();
    const kupon = await showActiveKupon();

    return {
      user: username,
      cart: cart,
      kupon: kupon,
    };
  } catch (error) {
    console.error("Error in userCartHandler:", error.message);
    throw new Error("Failed to fetch user cart data.");
  }
};

// user action handler

const handleDataAction = async ({ request }) => {
  const authData = getUsername();
  if (!authData || !authData.token) {
    alert("Authorization failed. Please log in.");
    return null;
  }

  try {
    const formData = await request.formData();
    const actionType = formData.get("actionType");
    const id_barang = formData.get("id_barang");
    const id_review = formData.get("id_review");
    const review = formData.get("review");
    const rating = formData.get("rating");
    const jumlah = formData.get("jumlah");

    // Determine the action type
    if (!actionType) {
      throw new Error("Action type is missing.");
    }

    let endpoint = "";
    let payload = {};

    switch (actionType) {
      case "addToCart":
        if (!id_barang || !jumlah) {
          throw new Error("Invalid input data for adding to cart.");
        }
        endpoint = "/users/cart";
        payload = { id_barang, jumlah };
        break;

      case "addReview":
        if (!id_barang || !review || !rating) {
          throw new Error("Invalid input data for adding a review.");
        }
        endpoint = `/users/review/${id_barang}`;
        payload = { review, rating: parseFloat(rating) };
        break;

      case "deleteReview":
        if (!id_barang || !id_review) {
          throw new Error("Invalid input data for deleting a review.");
        }
        endpoint = `/users/review/${id_barang}/${id_review}`;
        break;

      default:
        throw new Error("Unknown action type.");
    }

    console.log("Endpoint:", endpoint);
    console.log("Payload:", payload);

    const response = await client[
      actionType === "deleteReview" ? "delete" : "post"
    ](
      endpoint,
      actionType === "deleteReview"
        ? { headers: { Authorization: `Bearer ${authData.token}` } }
        : payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.token}`,
        },
      }
    );

    console.log("Response:", response.data, response.status);

    if (response.status === 201 || response.status === 200) {
      alert(response.data.message);

      // Redirect hanya jika actionType adalah "addToCart"
      if (actionType === "addToCart") {
        return redirect("/user/home");
      }
    } else {
      throw new Error(response.data.message || "Failed to process the action.");
    }
  } catch (error) {
    console.error("Error details:", error.response?.data || error.message);
    alert(
      error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred."
    );
    return null;
  }
};

export const editCart = async ({ request }) => {
  try {
    let role = "";
    const authData = getUsername();
    if (!authData || !authData.token) {
      throw new Error("User not authenticated");
    }

    // Ambil data dari form
    const formData = await request.formData();
    const action = formData.get("action");
    const id_barang = formData.get("id_barang");

    // Siapkan payload untuk backend
    const payload = {
      action,
      id_barang,
      jumlah: formData.get("jumlah") || 0,
    };

    console.log("Payload:", payload); // Debugging
    console.log("Headers Authorization:", `Bearer ${authData.token}`); // Debugging

    if (authData.role == 1) role = "admin";
    else role = "users";

    // Kirim permintaan ke backend
    const response = await client.put(`/${role}/cart`, payload, {
      headers: {
        Authorization: `Bearer ${authData.token}`,
        "Content-Type": "application/json", // Tambahkan jika backend mengharapkan JSON
      },
    });

    if (response.status !== 200) {
      throw new Error(response.data.message || "Failed to edit cart.");
    }

    if (action === "delete") {
      alert(`Barang dengan ID ${id_barang} dihapus.`);
    }

    return response.data; // Return hasil
  } catch (error) {
    console.error("Error editing cart:", error); // Debugging
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred."
    );
  }
};

const checkoutCart = async ({ request }) => {
  try {
    const authData = getUsername();
    if (!authData || !authData.token) {
      throw new Error("User not authenticated");
    }

    const formData = await request.formData();
    const idCart = formData.get("id_cart");
    const paymentMethod = formData.get("payment_method");
    const couponId = formData.get("coupon_id");

    if (!idCart || !paymentMethod) {
      throw new Error("ID cart atau metode pembayaran tidak valid");
    }

    // Fetch cart details
    const cartResponse = await client.get("/users/cart", {
      headers: {
        Authorization: `Bearer ${authData.token}`,
      },
    });

    if (cartResponse.status !== 200) {
      throw new Error("Failed to fetch cart details.");
    }

    const cartData = cartResponse.data; // Assuming data contains the cart details
    console.log("Fetched Cart Data:", cartData);

    // Create PDF in memory
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Receipt", 10, 10);

    doc.setFontSize(12);
    doc.text(`Cart ID: ${idCart}`, 10, 20);
    doc.text(`User ID: ${cartData.id_user}`, 10, 30);

    doc.text("Cart Items:", 10, 40);
    cartData.cart.forEach((item, index) => {
      const itemY = 50 + index * 10;
      doc.text(`${index + 1}. ${item.barang.nama}`, 10, itemY);
      doc.text(
        `    Qty: ${item.jumlah} x ${item.barang.harga} = ${item.total}`,
        10,
        itemY + 5
      );
    });

    const lastItemY = 50 + cartData.cart.length * 10;
    doc.text(`Subtotal: ${cartData.subtotal}`, 10, lastItemY + 10);

    // Prepare payload for checkout
    const checkoutPayload = {
      id_cart: idCart,
      payment_method: paymentMethod,
      coupon_id: couponId,
    };

    console.log("Checkout Payload:", checkoutPayload);

    // Perform checkout
    const checkoutResponse = await client.post(
      "/users/checkout",
      checkoutPayload,
      {
        headers: {
          Authorization: `Bearer ${authData.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (checkoutResponse.status !== 200) {
      throw new Error(
        checkoutResponse.data.message || "Failed to checkout cart."
      );
    }

    const { payment_url } = checkoutResponse.data;

    if (paymentMethod === "qris") {
      // Open payment URL in a new tab
      window.open(payment_url, "_blank");
    } else {
      // Trigger PDF download after successful checkout
      // Get the current date and time
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      // Construct the filename
      const timestamp = `${day}-${month}-${year}_${hours}-${minutes}-${seconds}`;
      const filename = `receipt_${timestamp}.pdf`;

      // Save the PDF with the new filename
      doc.save(filename);
      alert("Checkout sukses! Receipt downloaded.");
    }

    // Redirect current tab to /user/home
    window.location.href = "/user/home";

    // Return for further processing if needed
    return checkoutResponse.data;
  } catch (error) {
    console.error("Error during checkout:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred."
    );
  }
};

const showMyTransaksi = async () => {
  try {
    const response = await client.get("/users/transaction", {
      headers: {
        Authorization: `Bearer ${getUsername().token}`,
      },
    });

    // Extract transactions from the response
    return response.data;
  } catch (error) {
    console.error("Failed to load transaction data:", error);
    throw new Error("Failed to load transaction data");
  }
};

const showTransaksiHandler = async () => {
  try {
    const username = getUsername();
    const response = await showMyTransaksi();

    // Log the full response to debug
    console.log("API Response:", response);

    // Ensure the correct structure with 'transactions'
    if (!response?.transactions || !Array.isArray(response.transactions)) {
      console.error("Invalid transaction data structure:", response);
      throw new Error("Invalid transaction data structure.");
    }

    return {
      user: username,
      transaksi: response.transactions, // Corrected to use 'transactions'
    };
  } catch (error) {
    console.error("Error in showTransaksiHandler:", error.message);
    throw new Error("Failed to fetch user transaction data.");
  }
};

const checkoutAdminCart = async ({ request }) => {
  try {
    const authData = getUsername(); // Retrieve user authentication data
    if (!authData || !authData.token) {
      throw new Error("User not authenticated");
    }

    const formData = await request.formData();
    const idCart = formData.get("id_cart");
    const paymentMethod = formData.get("payment_method");
    const couponId = formData.get("coupon_id"); // Optional coupon ID
    const firstName = formData.get("first_name");
    const lastName = formData.get("last_name");
    const email = formData.get("email");

    // Validate input fields
    if (!idCart || !paymentMethod || !firstName || !lastName || !email) {
      throw new Error(
        "Missing required fields: ID cart, payment method, first name, last name, or email"
      );
    }

    const payload = {
      id_cart: idCart,
      payment_method: paymentMethod,
      coupon_id: couponId, // Optional coupon ID
      first_name: firstName,
      last_name: lastName,
      email: email,
    };

    console.log("Payload:", payload); // Debugging
    console.log("Headers Authorization:", `Bearer ${authData.token}`); // Debugging

    // Make the request to the /admin/checkout endpoint
    const response = await client.post("/admin/checkout", payload, {
      headers: {
        Authorization: `Bearer ${authData.token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 200) {
      throw new Error(response.data.message || "Failed to checkout cart.");
    }

    const { payment_url } = response.data;
    if (!payment_url) {
      throw new Error("Payment URL not found in the response.");
    }

    // Open payment URL in a new tab
    if (paymentMethod === "qris") {
      window.open(payment_url, "_blank");
    } else {
      alert("checkout berhasil");
    }

    // Redirect the current tab to the admin home page
    window.location.href = "/admin/home";

    return response.data; // Optional: for further processing
  } catch (error) {
    console.error("Error during checkout:", error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred."
    );
  }
};

const topupSaldo = async ({ request }) => {
  const authData = getUsername();
  if (!authData || !authData.token) {
    alert("Authorization failed. Please log in.");
    return null;
  }

  try {
    const formData = await request.formData();
    const amount = formData.get("amount");

    console.log("Payload:", { amount });

    if (!amount || isNaN(amount) || amount <= 0) {
      throw new Error("Invalid top-up amount.");
    }

    const response = await client.post(
      "/user/topup",
      { amount: parseFloat(amount) },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.token}`,
        },
      }
    );

    console.log("Response:", response.data, response.status);

    if (response.status === 200) {
      alert("Topup successful!");
      return redirect("/user/home"); // Redirect to the home page after successful top-up
    } else {
      throw new Error(response.data.message || "Failed to process top-up.");
    }
  } catch (error) {
    console.error("Error details:", error.response?.data || error.message);
    alert(
      error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred."
    );
    return null;
  }
};

const getCurrentSaldo = async () => {
  const authData = getUsername(); // Get authentication data
  if (!authData || !authData.token) {
    alert("Authorization failed. Please log in.");
    return null;
  }

  try {
    const response = await client.get("/user/saldo", {
      headers: {
        Authorization: `Bearer ${authData.token}`,
      },
    });

    // If the response is successful, return the saldo
    if (response.status === 200) {
      return { saldo: response.data.saldo };
    } else {
      throw new Error(response.data.message || "Failed to fetch saldo.");
    }
  } catch (error) {
    // Handle 404 or other errors
    if (error.response && error.response.status === 404) {
      console.warn("Saldo not found.");
      return { saldo: 0 }; // Default structure
    }

    console.error("Failed to fetch saldo:", error);
    throw new Error("Something went wrong while fetching saldo.");
  }
};

const userTopUpPage = async () => {
  try {
    const username = getUsername();
    const saldo = await getCurrentSaldo();

    return {
      user: username,
      saldo: saldo,
    };
  } catch (error) {
    console.error("Error in userTopUpPage:", error.message);
    throw new Error("Failed to fetch user saldo data.");
  }
};

const showMyDetails = async () => {
  try {
    const response = await client.get("/users/details", {
      headers: {
        Authorization: `Bearer ${getUsername().token}`,
      },
    });

    // Extract user details from the response
    return response.data;
  } catch (error) {
    console.error("Failed to load user details:", error);
    throw new Error("Failed to load user details.");
  }
};

const showDetailsHandler = async () => {
  try {
    const username = getUsername(); // Get current user information
    const response = await showMyDetails();

    // Log the full response to debug
    console.log("API Response:", response);

    // Ensure the correct structure with 'user'
    if (!response?.user) {
      console.error("Invalid user data structure:", response);
      throw new Error("Invalid user data structure.");
    }

    return {
      user: username,
      details: response.user, // Attach the fetched user details
    };
  } catch (error) {
    console.error("Error in showDetailsHandler:", error.message);
    throw new Error("Failed to fetch user details.");
  }
};

const updatePass = async (userId, newPassword, confirmPassword) => {
  try {
    const response = await client.put(
      "/v1/users/update-password",
      {
        userId,
        newPassword,
        confirmPassword,
      },
      {
        headers: {
          "Content-Type": "application/json", // Ensure the content type is JSON
          Authorization: `Bearer ${getUsername().token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to update password:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update password."
    );
  }
};

export default {
  getAllData,
  getDetail,
  getDetailHome,
  RegisterAction,
  LoginAction,
  getUsername,
  showBarang,
  showDetailBarang,
  adminHomeHandler,
  adminDetailHandler,
  addBarangHandler,
  adminTransaksiHandler,
  adminJenisHandler,
  registerAdminHandler,
  adminCartHandler,
  editBarangHandler,
  adminKuponHandler,
  showJenis,
  addBarang,
  editBarang,
  addKupon,
  addJenis,
  registerAnotherAdmin,
  userHomeHandler,
  userDetailHandler,
  userCartHandler,
  handleDataAction,
  editCart,
  checkoutCart,
  showTransaksiHandler,
  adminReportHandler,
  checkoutAdminCart,
  adminTransReportHandler,
  topupSaldo,
  getCurrentSaldo,
  userTopUpPage,
  showDetailsHandler,
  updatePass,
};
