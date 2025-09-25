export const parseCSV = (csvText) => {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

  const books = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i]
      .split(",")
      .map((v) => v.trim().replace(/^"|"$/g, ""));

    if (values.length >= 5) {
      const book = {
        id: `book-${i}`,
        title: values[headers.indexOf("title")] || "",
        author: values[headers.indexOf("author")] || "",
        genre: values[headers.indexOf("genre")] || "",
        publishedYear: parseInt(
          values[headers.indexOf("publishedyear")] ||
            values[headers.indexOf("published year")] ||
            "0",
          10
        ),
        isbn: values[headers.indexOf("isbn")] || "",
        isModified: false,
        originalData: undefined,
      };

      books.push(book);
    }
  }

  return books;
};

export const generateCSV = (books) => {
  const headers = ["Title", "Author", "Genre", "PublishedYear", "ISBN"];
  const csvContent = [
    headers.join(","),
    ...books.map((book) =>
      [
        `"${book.title}"`,
        `"${book.author}"`,
        `"${book.genre}"`,
        book.publishedYear.toString(),
        `"${book.isbn}"`,
      ].join(",")
    ),
  ].join("\n");

  return csvContent;
};

export const downloadCSV = (books, filename = "edited-books.csv") => {
  const csvContent = generateCSV(books);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
