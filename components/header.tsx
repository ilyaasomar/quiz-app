import React from "react";
interface HeaderProps {
  title: string;
}
const Header = ({ title }: HeaderProps) => {
  return (
    <div>
      <p className="text-xl text-muted-foreground font-semibold dark:text-white">
        {title}
      </p>
    </div>
  );
};

export default Header;
