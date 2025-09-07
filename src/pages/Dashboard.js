import React, { useEffect, useState } from "react";
import api from "../services/api";
import Charts from "../components/Charts";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  useTheme,
  alpha,
  Chip,
  Fab,
  Fade,
  Zoom,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  LightMode,
  DarkMode,
  TrendingUp,
  Analytics,
  AccountBalanceWallet,
} from "@mui/icons-material";

export default function Dashboard({ darkMode, toggleDarkMode }) {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", category: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOption, setSortOption] = useState("");

  const theme = useTheme();

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.amount || !form.category) {
      setError("Please fill all fields");
      return;
    }

    try {
      const payload = { ...form, amount: Number(form.amount) };

      if (editingId) {
        const res = await api.put(`/expenses/${editingId}`, payload);
        setExpenses((prev) =>
          prev.map((ex) => (ex._id === editingId ? res.data : ex))
        );
        setEditingId(null);
      } else {
        const res = await api.post("/expenses", payload);
        setExpenses((prev) => [res.data, ...prev]);
      }

      setForm({ title: "", amount: "", category: "" });
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Operation failed");
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this expense?");
    if (!ok) return;
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Delete failed");
    }
  };

  let filteredExpenses = [...expenses];
  if (categoryFilter) {
    filteredExpenses = filteredExpenses.filter(
      (e) => e.category === categoryFilter
    );
  }
  if (startDate) {
    filteredExpenses = filteredExpenses.filter(
      (e) => new Date(e.date) >= new Date(startDate)
    );
  }
  if (endDate) {
    filteredExpenses = filteredExpenses.filter(
      (e) => new Date(e.date) <= new Date(endDate)
    );
  }
  if (sortOption === "date-desc") {
    filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortOption === "date-asc") {
    filteredExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortOption === "amount-desc") {
    filteredExpenses.sort((a, b) => b.amount - a.amount);
  } else if (sortOption === "amount-asc") {
    filteredExpenses.sort((a, b) => a.amount - b.amount);
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const avgExpense = expenses.length ? totalExpenses / expenses.length : 0;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%)"
          : "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)",
        pb: 4,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: darkMode
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 4,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 70% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <AccountBalanceWallet sx={{ fontSize: "2.5rem" }} />
              Expense Tracker
            </Typography>
            <IconButton
              onClick={toggleDarkMode}
              sx={{
                backgroundColor: alpha(theme.palette.background.paper, 0.1),
                backdropFilter: "blur(10px)",
                border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                color: theme.palette.common.white,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.background.paper, 0.2),
                },
              }}
            >
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Box>

          {/* Stats Cards */}
          <Box display="flex" gap={2} flexWrap="wrap">
            <Card
              sx={{
                minWidth: 200,
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "white",
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <TrendingUp sx={{ fontSize: "2rem" }} />
                  <Box>
                    <Typography variant="h6">Total Expenses</Typography>
                    <Typography variant="h4" fontWeight="bold">
                      ₹{totalExpenses.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card
              sx={{
                minWidth: 200,
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "white",
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Analytics sx={{ fontSize: "2rem" }} />
                  <Box>
                    <Typography variant="h6">Average Expense</Typography>
                    <Typography variant="h4" fontWeight="bold">
                      ₹{avgExpense.toFixed(0)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card
              sx={{
                minWidth: 200,
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "white",
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <AccountBalanceWallet sx={{ fontSize: "2rem" }} />
                  <Box>
                    <Typography variant="h6">Total Transactions</Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {expenses.length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Add/Edit Form */}
        <Fade in={showForm} timeout={300}>
          <Card
            sx={{
              mb: 4,
              background: darkMode
                ? "rgba(45, 55, 72, 0.9)"
                : "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: darkMode
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                : "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
            }}
          >
            <Box
              sx={{
                background: "linear-gradient(90deg, #667eea, #764ba2)",
                height: 4,
              }}
            />
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom fontWeight="600">
                {editingId ? "Edit Expense" : "Add New Expense"}
              </Typography>

              <Box
                component="form"
                onSubmit={submitForm}
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "1fr 1fr 1fr auto auto",
                  },
                  gap: 2,
                  mt: 2,
                  alignItems: "end",
                }}
              >
                <TextField
                  label="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: `0 2px 8px ${alpha(
                          theme.palette.primary.main,
                          0.15
                        )}`,
                      },
                    },
                  }}
                />
                <TextField
                  label="Amount"
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: `0 2px 8px ${alpha(
                          theme.palette.primary.main,
                          0.15
                        )}`,
                      },
                    },
                  }}
                />
                <TextField
                  label="Category"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: `0 2px 8px ${alpha(
                          theme.palette.primary.main,
                          0.15
                        )}`,
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: "none",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                    },
                  }}
                >
                  {editingId ? "Update" : "Add"}
                </Button>
                {editingId && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setEditingId(null);
                      setForm({ title: "", amount: "", category: "" });
                      setShowForm(false);
                    }}
                    sx={{
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": {
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Fade>

        {error && (
          <Chip
            label={error}
            color="error"
            sx={{ mb: 2, fontWeight: 500 }}
            onDelete={() => setError("")}
          />
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : (
          <>
            {/* Filters */}
            <Card
              sx={{
                mb: 4,
                background: darkMode
                  ? "rgba(45, 55, 72, 0.9)"
                  : "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(20px)",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Filter & Sort
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr",
                      md: "1fr 1fr 1fr 1fr",
                    },
                    gap: 2,
                  }}
                >
                  <FormControl>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      label="Category"
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      {[...new Set(expenses.map((e) => e.category))].map(
                        (cat) => (
                          <MenuItem key={cat} value={cat}>
                            {cat}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>

                  <TextField
                    type="date"
                    label="Start Date"
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />

                  <TextField
                    type="date"
                    label="End Date"
                    InputLabelProps={{ shrink: true }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />

                  <FormControl>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      label="Sort By"
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="">Default</MenuItem>
                      <MenuItem value="date-desc">Date (Newest)</MenuItem>
                      <MenuItem value="date-asc">Date (Oldest)</MenuItem>
                      <MenuItem value="amount-desc">
                        Amount (High → Low)
                      </MenuItem>
                      <MenuItem value="amount-asc">
                        Amount (Low → High)
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </CardContent>
            </Card>

            {/* Expenses Table */}
            <Card
              sx={{
                mb: 4,
                background: darkMode
                  ? "rgba(45, 55, 72, 0.9)"
                  : "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(20px)",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        background: darkMode
                          ? "rgba(102, 126, 234, 0.1)"
                          : "rgba(102, 126, 234, 0.05)",
                      }}
                    >
                      <TableCell sx={{ fontWeight: 600, fontSize: "1rem" }}>
                        Title
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "1rem" }}>
                        Amount
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "1rem" }}>
                        Category
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "1rem" }}>
                        Date
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: "1rem" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredExpenses.map((exp) => (
                      <TableRow
                        key={exp._id}
                        sx={{
                          "&:hover": {
                            background: alpha(theme.palette.primary.main, 0.04),
                          },
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        <TableCell sx={{ fontWeight: 500 }}>
                          {exp.title}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`₹${exp.amount.toLocaleString()}`}
                            color="primary"
                            variant="outlined"
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={exp.category}
                            variant="filled"
                            size="small"
                            sx={{
                              backgroundColor: alpha(
                                theme.palette.secondary.main,
                                0.2
                              ),
                              color: theme.palette.secondary.main,
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(exp.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(exp)}
                              sx={{
                                color: theme.palette.warning.main,
                                "&:hover": {
                                  backgroundColor: alpha(
                                    theme.palette.warning.main,
                                    0.1
                                  ),
                                },
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(exp._id)}
                              sx={{
                                color: theme.palette.error.main,
                                "&:hover": {
                                  backgroundColor: alpha(
                                    theme.palette.error.main,
                                    0.1
                                  ),
                                },
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredExpenses.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          sx={{ textAlign: "center", py: 4 }}
                        >
                          <Typography variant="body1" color="textSecondary">
                            No expenses found. Add your first expense to get
                            started!
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>

            {/* Charts */}
            {expenses.length > 0 && (
              <Card
                sx={{
                  background: darkMode
                    ? "rgba(45, 55, 72, 0.9)"
                    : "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    gutterBottom
                    fontWeight="600"
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Analytics />
                    Spending Overview
                  </Typography>
                  <Charts expenses={expenses} />
                </CardContent>
              </Card>
            )}
          </>
        )}
      </Container>

      {/* Floating Action Button */}
      <Zoom in={!showForm} timeout={300}>
        <Fab
          color="primary"
          onClick={() => setShowForm(true)}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
              transform: "scale(1.1)",
            },
            transition: "all 0.3s ease",
            zIndex: 1000,
          }}
        >
          <Add />
        </Fab>
      </Zoom>
    </Box>
  );
}
