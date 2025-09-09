const DATABASE_KEY = process.env.REACT_APP_DATABASE_KEY;

export const createClass = async (token, className) => {
  console.log(
    JSON.stringify({
      className,
    })
  );
  try {
    const res = await fetch(
      `https://createclass-${DATABASE_KEY}-uc.a.run.app/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(className),
      }
    );

    return { status: res.status, message: await res.json() };
  } catch (error) {
    return { status: 500, error: error.message };
  }
};

export const fetchCoachClasses = async (token) => {
  try {
    const res = await fetch(
      `https://fetchcoachclasses-$[DATABASE-KEY}-uc.a.run.app/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { status: res.status, data: await res.json() };
  } catch (error) {
    return { status: 500, error: error.message };
  }
};

export const deleteClass = async (token, classId) => {
  try {
    const res = await fetch(
      `https://deleteclass-$[DATABASE-KEY}-uc.a.run.app/?classId=${classId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { status: res.status, message: await res.json() };
  } catch (error) {
    return { status: 500, message: error.message };
  }
};
