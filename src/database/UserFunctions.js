const DATABASE_KEY = process.env.REACT_APP_DATABASE_KEY;

export const createUser = async (
  email,
  password,
  firstName,
  lastName,
  isCoach
) => {
  console.log(
    JSON.stringify({
      email,
      password,
      firstName,
      lastName,
      isCoach: isCoach,
    })
  );
  try {
    const res = await fetch(
      `https://createuser-${DATABASE_KEY}-uc.a.run.app/`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          isCoach: isCoach,
        }),
      }
    );

    return { status: res.status, message: await res.text() };
  } catch (error) {
    return { status: 500, error: error.message };
  }
};

export const fetchUserData = async (token) => {
  try {
    const res = await fetch(
      `https://fetchuserdata-${DATABASE_KEY}-uc.a.run.app/`,
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
