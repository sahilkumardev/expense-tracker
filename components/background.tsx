export function Background() {
  return (
    <>
      <div className="absolute -top-48 w-full h-36 flex justify-center items-center">
        <div className="w-sm h-36 transform rounded-full bg-linear-to-tl from-slate-800 via-green-500 to-zinc-400 blur-[150px]" />
      </div>
      <div
        className="fixed h-full top-0 left-0 right-0 -z-20"
        style={{
          width: "100%",
          height: "100%",
          backgroundSize: "109px",
          backgroundRepeat: "repeat",
          backgroundImage:
            'url("https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png")',
          opacity: 0.06,
          borderRadius: "0px",
        }}
      />
    </>
  );
}
