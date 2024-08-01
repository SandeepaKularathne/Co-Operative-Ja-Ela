package lk.cooperative.cooperativejaela.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Route {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "name")
    @Pattern(regexp = "^/?[A-Za-z0-9 -/]{3,45}/?$", message = "Invalid Name")
    private String name;
    @Basic
    @Column(name = "distance")
    @Pattern(regexp = "^\\d+(\\.\\d+)?\\s?km$", message = "Invalid Distance")
    private String distance;
    @Basic
    @Column(name = "routenumber")
    @Pattern(regexp = "^[A-Z]\\d+$", message = "Invalid Routenumber")
    private String routenumber;
    @ManyToOne
    @JoinColumn(name = "grade_id", referencedColumnName = "id", nullable = false)
    private Grade grade;
    @JsonIgnore
    @OneToMany(mappedBy = "route")
    private Collection<Shop> shops;
    @JsonIgnore
    @OneToMany(mappedBy = "route")
    private Collection<Store> stores;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDistance() {
        return distance;
    }

    public void setDistance(String distance) {
        this.distance = distance;
    }

    public String getRoutenumber() {
        return routenumber;
    }

    public void setRoutenumber(String routenumber) {
        this.routenumber = routenumber;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Route route = (Route) o;
        return id == route.id && Objects.equals(name, route.name) && Objects.equals(distance, route.distance) && Objects.equals(routenumber, route.routenumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, distance, routenumber);
    }

    public Grade getGrade() {
        return grade;
    }

    public void setGrade(Grade grade) {
        this.grade = grade;
    }

    public Collection<Shop> getShops() {
        return shops;
    }

    public void setShops(Collection<Shop> shops) {
        this.shops = shops;
    }

    public Collection<Store> getStores() {
        return stores;
    }

    public void setStores(Collection<Store> stores) {
        this.stores = stores;
    }
}
