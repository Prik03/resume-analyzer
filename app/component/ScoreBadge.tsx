const ScoreBadge = ({ score } : {score : number}) => {
  let badgeStyles = "";
  let label = "";

  if (score > 69) {
    badgeStyles = "bg-badge-green text-green-600";
    label = "Strong";
  } else if (score > 49) {
    badgeStyles = "bg-yellow-100 text-yellow-600";
    label = "Good Start";
  } else {
    badgeStyles = "bg-red-100 text-red-600";
    label = "Needs Work";
  }

  return (
    <div className={`inline-block px-3 py-1 rounded-full ${badgeStyles}`}>
      <p className="font-medium">{label}</p>
    </div>
  );
};

export default ScoreBadge;