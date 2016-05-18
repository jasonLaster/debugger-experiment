firefox_bin=`which firefox`;
string="$firefox_bin -v";
cmd=`$string`;
version=$(echo $cmd | tr -dc '0-9')
echo $cmd;
if [ "$version" -ge "460" ]; then
  sudo apt-get update;
  sudo apt-get install libpango1.0-0;
  sudo apt-get install firefox;
fi
