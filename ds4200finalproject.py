import pandas as pd
import geopandas 
import geodatasets
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from shapely.geometry import Point
import altair as alt
import warnings

# Load the dataset
file_path = "ds4200_project.csv"  
df = pd.read_csv(file_path)
avg_o3_per_city = df.groupby("City")["O3"].mean().reset_index()
avg_o3_per_city = avg_o3_per_city.sort_values(by="O3", ascending=False)

# Save processed data for D3.js
avg_o3_per_city.to_csv("average_o3_by_city.csv", index=False)
print(avg_o3_per_city)

# Code for AQI Map visualization

map = geopandas.read_file("/Users/arpithacoorg/Desktop/information presentation/project/gadm41_IND_shp")
map = map.to_crs("EPSG:4326")

india['City'] = india['City'].str.strip().str.title()
bucket_counts = india.groupby(['City', 'AQI_Bucket']).size().reset_index(name='count')
bucket_counts = bucket_counts.sort_values(['City', 'count'], ascending=[True, False])
most_common_aqi = bucket_counts.drop_duplicates('City')[['City', 'AQI_Bucket']]

cities = cities.to_crs(map.crs)
cities['City'] = cities['City'].str.strip().str.title()
cities = cities.merge(most_common_aqi, on='City', how='left')

colored_map = {
    "Good": "#31a354",
    "Satisfactory" : "#fee8c8",
    "Moderate" : "#fec44f",
    "Poor" : "#8856a7",
    "Very Poor" : "#f03b20",
    "Severe" : "#000000"
}
cities['color'] = cities['AQI_Bucket'].map(colored_map)


fig, ax = plt.subplots(figsize=(12, 12))
map.plot(ax=ax, color='beige', edgecolor='grey')


for aqi_bucket, color in colored_map.items():
    subset = cities[cities['AQI_Bucket'] == aqi_bucket]
    if subset.empty:
        continue
    subset.plot(ax=ax, marker='*', color=color, markersize=750, label=aqi_bucket)


for idx, row in cities.iterrows():
    ax.text(row.geometry.x, 
            row.geometry.y - 1.5,
            row["City"], 
            fontsize=12, 
            ha='right')


legend_handles = [mpatches.Patch(color=color, label=label) for label, color in colored_map.items()]
ax.legend(handles=legend_handles, title="AQI Bucket", loc='center left', bbox_to_anchor=(1, 0.5))


plt.title("India Map with Cities Colored by AQI Bucket")
plt.savefig('map.png')
plt.show()


warnings.simplefilter(action='ignore', category=FutureWarning)

# Code for CO levels Line chart visualization

df["Datetime"] = pd.to_datetime(df["Datetime"])
df["Month"] = df["Datetime"].dt.to_period("M")

numeric_cols = df.select_dtypes(include=["number"]).columns
df_agg = df.groupby(["Month", "City"])[numeric_cols].mean().reset_index()
df_agg["Month"] = df_agg["Month"].astype(str)

# Create dropdown selection
city_dropdown = alt.binding_select(options=df_agg["City"].unique(), name="Select City: ")
city_selection = alt.selection_point(fields=["City"], bind=city_dropdown, value=df_agg["City"].unique()[0])

chart = (
    alt.Chart(df_agg)
    .mark_line(point=True, opacity=0.7)
    .encode(
        x=alt.X("Month:T", title="Date", axis=alt.Axis(format="%Y-%m")),
        y=alt.Y("CO:Q", title="CO Levels (ppm)"),
        color=alt.Color("City:N", legend=None),
        tooltip=["City", "Month", "CO"],
    )
    .add_params(city_selection)
    .transform_filter(city_selection)
    .properties(title="CO Levels in Indian Cities Over Time", width=800, height=400)
)

#4th visualization code

# Your data
data = {
    "City": ["Bangalore", "Chennai", "Delhi", "Kolkata", "Mumbai"],
    "2020": [129.715027, 125.811749, 127.000000, 129.196175, 120.994262],
    "2021": [122.643014, 120.726301, 121.747945, 128.301918, 117.986849],
    "2022": [129.017260, 133.458082, 126.365479, 121.826575, 125.062740],
    "2023": [124.240274, 126.351781, 124.336438, 127.909863, 130.509315],
    "2024": [126.168306, 123.616940, 124.758743, 130.408197, 122.036612]
}

# Convert data into a DataFrame
df = pd.DataFrame(data)

df_melted = df.melt(id_vars=["City"], var_name="Year", value_name="Value")

# Create the selection dropdown for the Year
year_selector = alt.selection_single(
    fields=["Year"], bind=alt.binding_select(options=["2020", "2021", "2022", "2023", "2024"], name="Year")
)

# Create the interactive chart
chart = alt.Chart(df_melted).mark_bar().encode(
    x=alt.X('City:N', title="City"),
    y=alt.Y('Value:Q', title="Total Concentration of NO and NO2"),
    color=alt.Color('City:N', legend=None),  # Remove the legend by setting legend=None
    column='Year:N',
    tooltip=['City:N', 'Value:Q']
).add_params(year_selector).transform_filter(year_selector).interactive()

chart