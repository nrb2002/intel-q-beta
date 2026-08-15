export const passwordConfirmationRefinement = <
  T extends { password: string; confirmPassword: string }
>(
  data: T,
  ctx: {
    addIssue: (issue: {
      code: "custom";
      message: string;
      path: string[];
    }) => void;
  }
) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  }
};