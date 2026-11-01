const createRequest = async (url, options = {}) => {
  const response = await fetch(url, options);

  // Сервер возвращает 204 при успешном удалении
  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export default createRequest;